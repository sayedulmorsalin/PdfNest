import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = file.originalname.replace(/[^a-z0-9.\-_]/gi, '_');
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ];
    if (allowed.includes(file.mimetype) || /\.pptx?$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only .pptx and .ppt files are allowed'));
    }
  }
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['POST', 'GET'],
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Microsoft PowerPoint (COM Automation)' });
});

// Helper: safely escape a Windows path for use inside a PowerShell single-quoted string
function psSingleQuoteEscape(str) {
  return str.replace(/'/g, "''");
}

// Helper: cleanup temp files
function cleanupFiles(...files) {
  for (const f of files) {
    try { if (f && fs.existsSync(f)) fs.unlinkSync(f); } catch (e) { /* ignore */ }
  }
}

app.post('/api/convert-pptx', upload.single('file'), async (req, res) => {
  return handleConversion(req, res);
});

app.post('/api/convert/pptx-to-pdf', upload.single('file'), async (req, res) => {
  return handleConversion(req, res);
});

async function handleConversion(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = path.resolve(req.file.path);
  const fileNameWithoutExt = path.parse(req.file.filename).name;
  const outputPdfPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}.pdf`));
  const psScriptPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}_convert.ps1`));

  // Build the PowerShell script content
  // Presentations.Open params: FileName, ReadOnly(-1=True), Untitled(0=False), WithWindow(0=False)
  // SaveAs format 32 = ppSaveAsPDF
  const psScript = [
    `$ErrorActionPreference = 'Stop'`,
    `$ppt = $null`,
    `$pres = $null`,
    `try {`,
    `  $ppt = New-Object -ComObject PowerPoint.Application`,
    `  $pres = $ppt.Presentations.Open('${psSingleQuoteEscape(inputPath)}', -1, 0, 0)`,
    `  $pres.SaveAs('${psSingleQuoteEscape(outputPdfPath)}', 32)`,
    `  Write-Output 'SUCCESS'`,
    `} catch {`,
    `  Write-Error $_.Exception.Message`,
    `  exit 1`,
    `} finally {`,
    `  try { if ($pres) { $pres.Close() } } catch {}`,
    `  try { if ($ppt) { $ppt.Quit() } } catch {}`,
    `  try { if ($ppt) { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null } } catch {}`,
    `  [System.GC]::Collect()`,
    `  [System.GC]::WaitForPendingFinalizers()`,
    `}`,
  ].join('\n');

  fs.writeFileSync(psScriptPath, psScript, 'utf-8');

  const command = `powershell -NoProfile -ExecutionPolicy Bypass -File "${psScriptPath}"`;

  console.log(`[Convert] Processing: ${req.file.originalname}`);
  console.log(`[Convert] Input: ${inputPath}`);
  console.log(`[Convert] Output: ${outputPdfPath}`);

  exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
    // Always cleanup the .ps1 script
    cleanupFiles(psScriptPath);

    if (error) {
      console.error(`[Convert] PowerPoint COM error:`, stderr || error.message);
      console.error(`[Convert] stdout:`, stdout);

      // Don't delete input yet — LibreOffice fallback needs it
      if (!fs.existsSync(inputPath)) {
        return res.status(500).json({
          error: 'Conversion failed. The uploaded file was not found.',
        });
      }

      // Fallback: try LibreOffice if PowerPoint COM fails
      console.log('[Convert] Falling back to LibreOffice...');
      const libreCommand = `soffice --headless --convert-to pdf --outdir "${uploadsDir}" "${inputPath}"`;

      exec(libreCommand, { timeout: 120000 }, (loError, loStdout, loStderr) => {
        if (loError) {
          console.error(`[Convert] LibreOffice also failed:`, loStderr || loError.message);
          cleanupFiles(inputPath);
          return res.status(500).json({
            error: 'Conversion failed. Please check the server logs for details.',
            details: (stderr || '') + '\n' + (loStderr || '')
          });
        }

        if (fs.existsSync(outputPdfPath)) {
          sendPdfAndCleanup(res, inputPath, outputPdfPath, req.file.originalname);
        } else {
          cleanupFiles(inputPath);
          res.status(500).json({ error: 'LibreOffice fallback did not generate output.' });
        }
      });

      return;
    }

    console.log(`[Convert] PowerPoint COM output:`, stdout.trim());

    if (fs.existsSync(outputPdfPath)) {
      sendPdfAndCleanup(res, inputPath, outputPdfPath, req.file.originalname);
    } else {
      cleanupFiles(inputPath);
      res.status(500).json({ error: 'Output PDF was not generated by PowerPoint.' });
    }
  });
}

function sendPdfAndCleanup(res, inputPath, outputPdfPath, originalName) {
  const pdfName = originalName.replace(/\.pptx?$/i, '.pdf');
  res.download(outputPdfPath, pdfName, (err) => {
    if (err) {
      console.error('[Convert] Error sending file:', err);
    }
    cleanupFiles(inputPath, outputPdfPath);
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File size exceeds the 100MB limit.' });
    }
    return res.status(400).json({ error: error.message });
  }
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
});

app.listen(port, () => {
  console.log(`\n🚀 PdfNest Conversion Server running on http://localhost:${port}`);
  console.log(`   Engine: Microsoft PowerPoint (COM Automation)`);
  console.log(`   Fallback: LibreOffice Headless`);
  console.log(`   Max file size: 100MB\n`);
});
