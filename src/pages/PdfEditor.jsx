import { useState } from 'react';
import { FileUp, Download, Zap, Merge, Scissors, FileDown, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, LevelFormat, convertInchesToTwip,
} from 'docx';
import PptxGenJS from 'pptxgenjs';
import * as pdfjsLib from 'pdfjs-dist';

// ─── Smart PDF Structure Analyser ──────────────────────────────────────────────

/**
 * Extracts rich structured data from a PDF file using PDF.js.
 * Returns an array of logical "lines", each with text, fontSize, bold,
 * italic, x-indent, and page number.
 */
async function extractStructuredContent(file) {
  // pdfjs v5: workerSrc must be a string URL
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    // includeMarkedContent: false keeps items as pure TextItem (no TextMarkedContent mixed in)
    const textContent = await page.getTextContent({ includeMarkedContent: false });
    const viewport = page.getViewport({ scale: 1 });

    // pdfjs v5: item.fontName is an INTERNAL key (e.g. "g_d0_f1").
    // The human-readable font family lives in textContent.styles[item.fontName].fontFamily
    const styles = textContent.styles || {};

    // Group items into visual lines by their Y coordinate (transform[5])
    const lineMap = new Map();

    for (const item of textContent.items) {
      // Skip non-text items (TextMarkedContent has no .str)
      if (typeof item.str === 'undefined' || item.str.trim() === '') continue;

      const y = Math.round(viewport.height - item.transform[5]); // flip Y axis
      const x = Math.round(item.transform[4]);

      // pdfjs v5: font size = magnitude of the first column of the 2×3 transform matrix
      // transform = [scaleX, skewX, skewY, scaleY, translateX, translateY]
      const fontSize = Math.round(Math.hypot(item.transform[0], item.transform[1])) ||
                       Math.round(Math.abs(item.height)) || 11;

      // Resolve the human-readable font name from styles map (pdfjs v5 fix)
      const styleEntry = styles[item.fontName] || {};
      const resolvedFontFamily = (styleEntry.fontFamily || item.fontName || '').toLowerCase();

      const isBold = resolvedFontFamily.includes('bold') ||
                     resolvedFontFamily.includes('heavy') ||
                     resolvedFontFamily.includes('black');
      const isItalic = resolvedFontFamily.includes('italic') ||
                       resolvedFontFamily.includes('oblique');

      // Group by Y within a 3px tolerance
      let lineKey = null;
      for (const k of lineMap.keys()) {
        if (Math.abs(k - y) <= 3) { lineKey = k; break; }
      }
      if (lineKey === null) { lineKey = y; lineMap.set(lineKey, []); }

      lineMap.get(lineKey).push({ text: item.str, x, fontSize, isBold, isItalic });
    }

    // Sort lines top-to-bottom
    const sortedKeys = [...lineMap.keys()].sort((a, b) => a - b);

    for (const key of sortedKeys) {
      const items = lineMap.get(key).sort((a, b) => a.x - b.x);
      const minX = items[0].x;
      const maxFontSize = Math.max(...items.map(i => i.fontSize));
      // A line is bold if the majority of its characters are bold
      const boldCount = items.filter(i => i.isBold).length;
      const allBold = boldCount > items.length / 2;
      const allItalic = items.every(i => i.isItalic);
      const text = items.map(i => i.text).join('').replace(/\s+/g, ' ').trim();

      if (!text) continue;

      allLines.push({
        text,
        fontSize: maxFontSize,
        isBold: allBold,
        isItalic: allItalic,
        x: minX,
        page: pageNum,
        // Keep rich runs for mixed bold/italic on same line
        runs: items,
      });
    }

    // Add a page-break sentinel between pages
    if (pageNum < pdf.numPages) {
      allLines.push({ pageBreak: true, page: pageNum });
    }
  }

  return allLines;
}

/**
 * Classify each line into a role: heading1, heading2, heading3, bullet, body, spacer
 */
function classifyLines(lines) {
  // Collect all font sizes to compute median body size
  const sizes = lines.filter(l => !l.pageBreak && l.fontSize > 0).map(l => l.fontSize);
  const sorted = [...sizes].sort((a, b) => a - b);
  const medianSize = sorted[Math.floor(sorted.length / 2)] || 11;

  // Common indent baseline (leftmost X across all lines)
  const xValues = lines.filter(l => !l.pageBreak).map(l => l.x);
  const baseX = Math.min(...xValues);

  return lines.map(line => {
    if (line.pageBreak) return { ...line, role: 'pageBreak' };

    const { text, fontSize, isBold, x } = line;
    const indent = x - baseX;
    const isBullet = /^[\u2022\u2023\u25e6\u2043\u2219\-\*]\s/.test(text) || /^\d+\.\s/.test(text);
    const isNumberedBullet = /^\d+\.\s/.test(text);

    let role = 'body';

    if (fontSize >= medianSize * 1.8 || (fontSize >= medianSize * 1.4 && isBold)) {
      role = 'heading1';
    } else if (fontSize >= medianSize * 1.35 || (fontSize >= medianSize * 1.2 && isBold)) {
      role = 'heading2';
    } else if (fontSize >= medianSize * 1.15 || (fontSize > medianSize && isBold)) {
      role = 'heading3';
    } else if (isBullet) {
      role = isNumberedBullet ? 'numberedBullet' : 'bullet';
    } else if (indent > 20 && fontSize <= medianSize) {
      role = 'indented';
    }

    return { ...line, role, indent };
  });
}

// ─── DOCX Builder ──────────────────────────────────────────────────────────────

function buildDocxParagraphs(classifiedLines) {
  const paragraphs = [];

  for (const line of classifiedLines) {
    if (line.pageBreak) {
      paragraphs.push(new Paragraph({ pageBreakBefore: true }));
      continue;
    }

    const { text, role, isBold, isItalic, runs } = line;

    // Build text runs - try to preserve mixed bold/italic within a line
    const makeRuns = (overrideBold) =>
      runs && runs.length > 1
        ? runs.map(r => new TextRun({
            text: r.text + ' ',
            bold: r.isBold || overrideBold,
            italics: r.isItalic || isItalic,
            size: 22, // 11pt default
          }))
        : [new TextRun({ text, bold: isBold || overrideBold, italics: isItalic, size: 22 })];

    if (role === 'heading1') {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [new TextRun({ text, bold: true, size: 32 })],
        spacing: { before: 240, after: 120 },
      }));

    } else if (role === 'heading2') {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text, bold: true, size: 26 })],
        spacing: { before: 200, after: 80 },
      }));

    } else if (role === 'heading3') {
      paragraphs.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: [new TextRun({ text, bold: true, size: 24 })],
        spacing: { before: 160, after: 60 },
      }));

    } else if (role === 'bullet') {
      const cleanText = text.replace(/^[\u2022\u2023\u25e6\u2043\u2219\-\*]\s*/, '').trim();
      paragraphs.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: cleanText, size: 22 })],
        spacing: { after: 60 },
      }));

    } else if (role === 'numberedBullet') {
      const cleanText = text.replace(/^\d+\.\s*/, '').trim();
      paragraphs.push(new Paragraph({
        numbering: { reference: 'numbered-list', level: 0 },
        children: [new TextRun({ text: cleanText, size: 22 })],
        spacing: { after: 60 },
      }));

    } else if (role === 'indented') {
      paragraphs.push(new Paragraph({
        indent: { left: convertInchesToTwip(0.5) },
        children: makeRuns(false),
        spacing: { after: 80 },
      }));

    } else {
      // body
      paragraphs.push(new Paragraph({
        children: makeRuns(false),
        spacing: { after: 100 },
        alignment: AlignmentType.JUSTIFIED,
      }));
    }
  }

  return paragraphs;
}

// ─── Utility: Manual Download Trigger ────────────────────────────────────────

/**
 * Manually triggers a browser download for a Blob with a specific filename.
 * This is a more robust alternative to file-saver for some environments.
 */
function triggerDownload(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to body, click, and cleanup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Small delay before revoking to ensure browser starts download
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}

// ─── Main Converter Functions ──────────────────────────────────────────────────

async function convertPdfToWord(file, onProgress) {
  onProgress('Analyzing PDF structure…');
  const rawLines = await extractStructuredContent(file);
  
  if (!rawLines || rawLines.length === 0) {
    throw new Error("No text content found. This PDF might be scanned (an image) or protected. Please try a searchable PDF.");
  }

  onProgress('Classifying text elements…');
  const classified = classifyLines(rawLines);

  onProgress('Building Word document…');
  const paragraphs = buildDocxParagraphs(classified);

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'numbered-list',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } },
              },
            },
          ],
        },
      ],
    },
    sections: [{ children: paragraphs }],
  });

  onProgress('Generating file…');
  const blob = await Packer.toBlob(doc);
  
  // Generate a clean filename
  const baseName = (file.name || 'document').replace(/\.[^/.]+$/, "").replace(/[^a-z0-9\-_ ]/gi, '_');
  const fileName = `${baseName}.docx`;
    
  triggerDownload(blob, fileName);
}

async function convertPdfToPptx(file, onProgress) {
  onProgress('Extracting PDF content…');
  const rawLines = await extractStructuredContent(file);
  
  if (!rawLines || rawLines.length === 0) {
    throw new Error("No content found in PDF. Scanned documents are not yet supported.");
  }
  
  const classified = classifyLines(rawLines);

  onProgress('Building PowerPoint slides…');
  const prs = new PptxGenJS();
  const PRIMARY = '2563EB';
  const DARK = '111827';
  const GRAY = '6B7280';

  // Title slide
  const titleLine = classified.find(l => l.role === 'heading1' || l.role === 'heading2');
  const slide0 = prs.addSlide();
  slide0.background = { color: 'F8FAFC' };
  slide0.addText(titleLine ? titleLine.text : file.name.replace(/\.pdf$/i, ''), {
    x: 0.8, y: 1.8, w: 8.4, h: 1.4,
    fontSize: 40, bold: true, color: PRIMARY, align: 'center', fontFace: 'Calibri',
  });
  slide0.addShape(prs.ShapeType.rect, { x: 3.5, y: 4.0, w: 3, h: 0.06, fill: { color: PRIMARY }, line: { type: 'none' } });
  slide0.addText(new Date().toLocaleDateString(), {
    x: 0.8, y: 4.3, w: 8.4, h: 0.4, fontSize: 14, color: GRAY, align: 'center',
  });

  // Group content lines into slide-sized chunks
  const contentLines = classified.filter(l => !l.pageBreak && l.role !== 'heading1');
  const LINES_PER_SLIDE = 12;
  const chunks = [];
  for (let i = 0; i < contentLines.length; i += LINES_PER_SLIDE) {
    chunks.push(contentLines.slice(i, i + LINES_PER_SLIDE));
  }

  chunks.forEach((chunk, idx) => {
    const slide = prs.addSlide();
    slide.background = { color: 'FFFFFF' };

    // Header bar
    slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: PRIMARY }, line: { type: 'none' } });
    slide.addText(`Page ${idx + 1}`, {
      x: 0.3, y: 0.1, w: 9.4, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', fontFace: 'Calibri',
    });

    // Content rows
    let yPos = 0.9;
    for (const line of chunk) {
      if (yPos > 6.5) break;
      const isHead = line.role === 'heading2' || line.role === 'heading3';
      slide.addText(line.role === 'bullet' ? `• ${line.text.replace(/^[\u2022\-\*]\s*/, '')}` : line.text, {
        x: 0.4, y: yPos, w: 9.2, h: isHead ? 0.5 : 0.38,
        fontSize: isHead ? 18 : 13,
        bold: isHead || line.isBold,
        color: isHead ? PRIMARY : DARK,
        fontFace: 'Calibri',
        align: 'left',
      });
      yPos += isHead ? 0.55 : 0.42;
    }
  });

  onProgress('Saving file…');
  const pptxBlob = await prs.write({ outputType: 'blob' });
  
  // Generate a clean filename
  const baseName = (file.name || 'presentation').replace(/\.[^/.]+$/, "").replace(/[^a-z0-9\-_ ]/gi, '_');
  const fileName = `${baseName}.pptx`;

  triggerDownload(pptxBlob, fileName);
}

// ─── React Component ───────────────────────────────────────────────────────────

export default function PdfEditor() {
  const [activeTab, setActiveTab] = useState('converter');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' }); // null | 'loading' | 'success' | 'error'
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', icon: null });

  const tabs = [
    { id: 'converter', name: 'PDF Converter', icon: Zap },
    { id: 'merger', name: 'PDF Merger', icon: Merge },
    { id: 'splitter', name: 'PDF Splitter', icon: Scissors },
    { id: 'compressor', name: 'PDF Compressor', icon: FileDown },
  ];

  const showAlert = (title, message, icon) => {
    setAlertModal({ isOpen: true, title, message, icon });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  const AlertModal = () => (
    <AnimatePresence>
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlert}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button onClick={closeAlert} className="p-1 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {alertModal.icon ? <alertModal.icon className="w-8 h-8 text-primary" /> : <Zap className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{alertModal.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {alertModal.message}
              </p>
              <button
                onClick={closeAlert}
                className="mt-8 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const handleFileUpload = (e) => setSelectedFiles(Array.from(e.target.files));

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length) setSelectedFiles(files);
  };

  const handleConvert = async (format) => {
    if (!selectedFiles.length) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }
    const file = selectedFiles[0];
    setStatus({ type: 'loading', message: 'Starting conversion…' });

    try {
      if (format === 'DOCX') {
        await convertPdfToWord(file, msg => setStatus({ type: 'loading', message: msg }));
        setStatus({ type: 'success', message: '✅ Word document downloaded with preserved formatting!' });
      } else if (format === 'PPTX') {
        await convertPdfToPptx(file, msg => setStatus({ type: 'loading', message: msg }));
        setStatus({ type: 'success', message: '✅ PowerPoint downloaded successfully!' });
      } else {
        setStatus({ type: 'error', message: `${format} conversion coming soon!` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: `❌ Error: ${err.message}` });
      console.error(err);
    }
  };

  const converterOptions = [
    { format: 'DOCX', label: 'PDF → Word', description: 'Preserves headings, bullets, bold, paragraphs', icon: '📄' },
    { format: 'PPTX', label: 'PDF → PowerPoint', description: 'Smart slide layout from PDF structure', icon: '📊' },
    { format: 'PNG', label: 'PDF → PNG', description: 'High-quality image export (coming soon)', icon: '🖼️' },
    { format: 'JPG', label: 'PDF → JPG', description: 'Compressed image export (coming soon)', icon: '🗜️' },
  ];

  const StatusBar = () => {
    if (!status.type) return null;
    const colors = {
      loading: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      success: 'bg-green-500/10 border-green-500/30 text-green-300',
      error: 'bg-red-500/10 border-red-500/30 text-red-300',
    };
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg border text-sm ${colors[status.type]}`}>
        {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
        {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
        {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
        <span>{status.message}</span>
      </div>
    );
  };

  const renderConverterTab = () => (
    <div className="space-y-6">
      <StatusBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {converterOptions.map((opt) => (
          <div
            key={opt.format}
            onClick={() => handleConvert(opt.format)}
            className="p-6 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{opt.icon}</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                  {opt.label}
                </h3>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
              <Download className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-200 space-y-1">
        <p className="font-semibold">💡 How it works</p>
        <ul className="list-disc list-inside text-xs space-y-1 text-amber-200/80">
          <li>Analyses font sizes to detect headings vs body text</li>
          <li>Detects bold, italic, bullet points and indentation</li>
          <li>Reconstructs Word styles: Heading 1, Heading 2, bullet lists</li>
          <li>Preserves paragraph spacing and text alignment</li>
        </ul>
      </div>
    </div>
  );

  const renderMergerTab = () => (
    <div className="p-8 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 transition-colors">
      <Merge className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Merge PDF Files</h3>
      <p className="text-muted-foreground mb-4 text-sm">Combine multiple PDFs into one document</p>
      <button
        onClick={() => showAlert('Coming Soon', 'Our PDF Merger tool is currently in development. You will soon be able to combine multiple PDF files into a single document right in your browser.', Merge)}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Coming Soon
      </button>
    </div>
  );

  const renderSplitterTab = () => (
    <div className="p-8 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 transition-colors">
      <Scissors className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Split PDF</h3>
      <p className="text-muted-foreground mb-4 text-sm">Extract pages or split into multiple files</p>
      <button
        onClick={() => showAlert('Coming Soon', 'The PDF Splitter is almost ready! Soon you will be able to extract specific pages or split large PDFs into multiple smaller files with ease.', Scissors)}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Coming Soon
      </button>
    </div>
  );

  const renderCompressorTab = () => (
    <div className="p-8 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 transition-colors">
      <FileDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Compress PDF</h3>
      <p className="text-muted-foreground mb-4 text-sm">Reduce file size while maintaining quality</p>
      <button
        onClick={() => showAlert('Coming Soon', 'We are working on a high-performance PDF Compressor that reduces file size while maintaining excellent visual quality.', FileDown)}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Coming Soon
      </button>
    </div>
  );

  const tabComponents = { converter: renderConverterTab, merger: renderMergerTab, splitter: renderSplitterTab, compressor: renderCompressorTab };

  return (
    <>
      <SEO
        title="Professional PDF Editor & Converter"
        description="Free online PDF editor to convert PDF to Word with preserved formatting, PDF to PowerPoint, merge, split, and compress PDFs. 100% browser-based for maximum security."
        canonical="/pdf-editor"
        keywords="PDF to Word, PDF converter, merge PDF, split PDF, compress PDF, PDF to PPTX, browser-based PDF editor"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PdfNest PDF Editor",
          "operatingSystem": "Web",
          "applicationCategory": "OfficeApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": "Convert PDF to Word, Convert PDF to PowerPoint, Merge PDF, Split PDF, Compress PDF",
          "screenshot": "https://pdfnest.com/screenshots/pdf-editor.png"
        }}
      />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-4 py-12 md:py-20 border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">PDF TOOLS</p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              All-in-One PDF Editor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert PDFs with <strong className="text-white">preserved formatting</strong> — headings, bullets, bold text and paragraph structure are kept intact. 100% browser-based, no uploads.
            </p>
          </div>
        </section>

        {/* Upload */}
        <section className="px-4 py-8 border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <label
              className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <FileUp className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
              <span className="text-lg font-semibold text-white mb-1">
                {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Click or drag & drop PDF here'}
              </span>
              <span className="text-sm text-muted-foreground">Supports single or multiple PDF files</span>
              <input type="file" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
            </label>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-white">📄 {file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tabs */}
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-primary/10 border border-primary/50 text-primary'
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
            <div className="space-y-6">{tabComponents[activeTab]()}</div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-12 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose Our PDF Editor?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: '🎯 Format Preserved', description: 'Headings, bold, bullets and spacing are reconstructed accurately' },
                { title: '🔒 100% Secure', description: 'No server uploads — all processing happens in your browser' },
                { title: '⚡ Free Forever', description: 'No signup, no watermarks, no limits' },
              ].map((f, i) => (
                <div key={i} className="p-6 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <AlertModal />
    </>
  );
}
