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
    const allowedExtensions = /\.(pptx|ppt|docx|doc|pdf)$/i;
    if (allowedExtensions.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only .pptx, .ppt, .docx, .doc, and .pdf files are allowed'));
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
  res.json({ status: 'ok', engine: 'Microsoft Office COM Automation & LibreOffice' });
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

// Helper to send downloaded file and clean up
function sendFileAndCleanup(res, inputPath, outputPath, downloadName) {
  res.download(outputPath, downloadName, (err) => {
    if (err) {
      console.error('[Convert] Error sending file:', err);
    }
    cleanupFiles(inputPath, outputPath);
  });
}

function getLibreOfficeExe() {
  const possiblePaths = [
    'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
    'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return `"${p}"`;
  }
  return 'soffice';
}

// ─── 1. PowerPoint to PDF ───────────────────────────────────────────────────────
app.post('/api/convert-pptx', upload.single('file'), async (req, res) => handlePptxToPdf(req, res));
app.post('/api/convert/pptx-to-pdf', upload.single('file'), async (req, res) => handlePptxToPdf(req, res));

async function handlePptxToPdf(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const inputPath = path.resolve(req.file.path);
  const fileNameWithoutExt = path.parse(req.file.filename).name;
  const outputPdfPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}.pdf`));
  const psScriptPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}_pptx_convert.ps1`));

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

  console.log(`[PPTX->PDF] Processing: ${req.file.originalname}`);

  exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
    cleanupFiles(psScriptPath);

    if (error) {
      console.error(`[PPTX->PDF] PowerPoint COM error:`, stderr || error.message);
      console.log('[PPTX->PDF] Falling back to LibreOffice...');
      const libreCommand = `${getLibreOfficeExe()} --headless --convert-to pdf --outdir "${uploadsDir}" "${inputPath}"`;

      exec(libreCommand, { timeout: 120000 }, (loError, loStdout, loStderr) => {
        if (loError || !fs.existsSync(outputPdfPath)) {
          cleanupFiles(inputPath);
          return res.status(500).json({ error: 'PowerPoint to PDF conversion failed.' });
        }
        sendFileAndCleanup(res, inputPath, outputPdfPath, req.file.originalname.replace(/\.pptx?$/i, '.pdf'));
      });
      return;
    }

    if (fs.existsSync(outputPdfPath)) {
      sendFileAndCleanup(res, inputPath, outputPdfPath, req.file.originalname.replace(/\.pptx?$/i, '.pdf'));
    } else {
      cleanupFiles(inputPath);
      res.status(500).json({ error: 'Output PDF was not generated.' });
    }
  });
}

// ─── 2. Word to PDF ─────────────────────────────────────────────────────────────
app.post('/api/convert/word-to-pdf', upload.single('file'), async (req, res) => handleWordToPdf(req, res));
app.post('/api/convert-word', upload.single('file'), async (req, res) => handleWordToPdf(req, res));

async function handleWordToPdf(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const inputPath = path.resolve(req.file.path);
  const fileNameWithoutExt = path.parse(req.file.filename).name;
  const outputPdfPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}.pdf`));
  const psScriptPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}_word_convert.ps1`));

  const psScript = [
    `$ErrorActionPreference = 'Stop'`,
    `$word = $null`,
    `$doc = $null`,
    `try {`,
    `  $word = New-Object -ComObject Word.Application`,
    `  $word.Visible = $false`,
    `  $word.DisplayAlerts = 0`,
    `  $word.AutomationSecurity = 3`,
    `  $doc = $word.Documents.Open('${psSingleQuoteEscape(inputPath)}', $false, $true)`,
    `  $doc.SaveAs([ref]'${psSingleQuoteEscape(outputPdfPath)}', [ref]17)`,
    `  Write-Output 'SUCCESS'`,
    `} catch {`,
    `  Write-Error $_.Exception.Message`,
    `  exit 1`,
    `} finally {`,
    `  try { if ($doc) { $doc.Close([ref]0) } } catch {}`,
    `  try { if ($word) { $word.Quit() } } catch {}`,
    `  try { if ($word) { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null } } catch {}`,
    `  [System.GC]::Collect()`,
    `  [System.GC]::WaitForPendingFinalizers()`,
    `}`,
  ].join('\n');

  fs.writeFileSync(psScriptPath, psScript, 'utf-8');
  const command = `powershell -NoProfile -ExecutionPolicy Bypass -File "${psScriptPath}"`;

  console.log(`[WORD->PDF] Processing: ${req.file.originalname}`);

  exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
    cleanupFiles(psScriptPath);

    if (error) {
      console.error(`[WORD->PDF] Word COM error:`, stderr || error.message);
      console.log('[WORD->PDF] Falling back to LibreOffice...');
      const libreCommand = `${getLibreOfficeExe()} --headless --convert-to pdf --outdir "${uploadsDir}" "${inputPath}"`;

      exec(libreCommand, { timeout: 120000 }, (loError, loStdout, loStderr) => {
        if (loError || !fs.existsSync(outputPdfPath)) {
          cleanupFiles(inputPath);
          return res.status(500).json({ error: 'Word to PDF conversion failed.' });
        }
        sendFileAndCleanup(res, inputPath, outputPdfPath, req.file.originalname.replace(/\.docx?$/i, '.pdf'));
      });
      return;
    }

    if (fs.existsSync(outputPdfPath)) {
      sendFileAndCleanup(res, inputPath, outputPdfPath, req.file.originalname.replace(/\.docx?$/i, '.pdf'));
    } else {
      cleanupFiles(inputPath);
      res.status(500).json({ error: 'Output PDF was not generated by Word.' });
    }
  });
}

// ─── 3. PDF to Word ─────────────────────────────────────────────────────────────
app.post('/api/convert/pdf-to-word', upload.single('file'), async (req, res) => handlePdfToWord(req, res));
app.post('/api/convert-pdf-to-word', upload.single('file'), async (req, res) => handlePdfToWord(req, res));

async function handlePdfToWord(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const inputPath = path.resolve(req.file.path);
  const fileNameWithoutExt = path.parse(req.file.filename).name;
  const outputDocxPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}.docx`));
  const psScriptPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}_pdf2word_convert.ps1`));

  const psScript = [
    `$ErrorActionPreference = 'Stop'`,
    `$word = $null`,
    `$doc = $null`,
    `try {`,
    `  $word = New-Object -ComObject Word.Application`,
    `  $word.Visible = $false`,
    `  $word.DisplayAlerts = 0`,
    `  $word.AutomationSecurity = 3`,
    `  $doc = $word.Documents.Open('${psSingleQuoteEscape(inputPath)}', $false, $true, $false)`,
    `  $doc.SaveAs([ref]'${psSingleQuoteEscape(outputDocxPath)}', [ref]16)`,
    `  Write-Output 'SUCCESS'`,
    `} catch {`,
    `  Write-Error $_.Exception.Message`,
    `  exit 1`,
    `} finally {`,
    `  try { if ($doc) { $doc.Close([ref]0) } } catch {}`,
    `  try { if ($word) { $word.Quit() } } catch {}`,
    `  try { if ($word) { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null } } catch {}`,
    `  [System.GC]::Collect()`,
    `  [System.GC]::WaitForPendingFinalizers()`,
    `}`,
  ].join('\n');

  fs.writeFileSync(psScriptPath, psScript, 'utf-8');
  const command = `powershell -NoProfile -ExecutionPolicy Bypass -File "${psScriptPath}"`;

  console.log(`[PDF->WORD] Processing: ${req.file.originalname}`);

  exec(command, { timeout: 120000 }, (error, stdout, stderr) => {
    cleanupFiles(psScriptPath);

    if (error) {
      console.error(`[PDF->WORD] Word COM error:`, stderr || error.message);
      console.log('[PDF->WORD] Falling back to LibreOffice...');
      const libreCommand = `${getLibreOfficeExe()} --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${uploadsDir}" "${inputPath}"`;

      exec(libreCommand, { timeout: 120000 }, (loError, loStdout, loStderr) => {
        if (loError || !fs.existsSync(outputDocxPath)) {
          cleanupFiles(inputPath);
          return res.status(500).json({ error: 'PDF to Word conversion failed.' });
        }
        sendFileAndCleanup(res, inputPath, outputDocxPath, req.file.originalname.replace(/\.pdf$/i, '.docx'));
      });
      return;
    }

    if (fs.existsSync(outputDocxPath)) {
      sendFileAndCleanup(res, inputPath, outputDocxPath, req.file.originalname.replace(/\.pdf$/i, '.docx'));
    } else {
      cleanupFiles(inputPath);
      res.status(500).json({ error: 'Output DOCX was not generated.' });
    }
  });
}

// ─── 4. PDF to PowerPoint ────────────────────────────────────────────────────────
app.post('/api/convert/pdf-to-pptx', upload.single('file'), async (req, res) => handlePdfToPptx(req, res));
app.post('/api/convert-pdf-to-pptx', upload.single('file'), async (req, res) => handlePdfToPptx(req, res));

async function handlePdfToPptx(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const inputPath = path.resolve(req.file.path);
  const fileNameWithoutExt = path.parse(req.file.filename).name;
  const outputPptxPath = path.resolve(path.join(uploadsDir, `${fileNameWithoutExt}.pptx`));

  console.log(`[PDF->PPTX] Processing: ${req.file.originalname}`);

  const libreCommand = `${getLibreOfficeExe()} --headless --infilter="impress_pdf_import" --convert-to pptx --outdir "${uploadsDir}" "${inputPath}"`;

  exec(libreCommand, { timeout: 120000 }, (loError, loStdout, loStderr) => {
    if (loError || !fs.existsSync(outputPptxPath)) {
      console.error(`[PDF->PPTX] LibreOffice error:`, loStderr || (loError && loError.message));
      cleanupFiles(inputPath);
      return res.status(500).json({ error: 'PDF to PowerPoint conversion failed on server.' });
    }
    sendFileAndCleanup(res, inputPath, outputPptxPath, req.file.originalname.replace(/\.pdf$/i, '.pptx'));
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
  console.log(`   Engine: Microsoft Office COM Automation & LibreOffice`);
  console.log(`   Max file size: 100MB\n`);
});
