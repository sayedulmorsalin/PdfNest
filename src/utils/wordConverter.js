import { UDocClient } from '@docmentis/udoc-viewer';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';
import { tryServerConvert } from './serverConverter';
import { triggerDownload, extractStructuredContent, classifyLines } from './pdfConverter';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip,
} from 'docx';

/**
 * Word to PDF Converter
 * 1) Tries local Microsoft Word COM Automation / LibreOffice server (/api/convert/word-to-pdf)
 * 2) Falls back to browser WebAssembly (@docmentis/udoc-viewer + jsPDF)
 */
export async function convertWordToPdf(file, onProgress) {
  onProgress('Starting Word to PDF conversion...');

  // Try server engine first
  const serverSuccess = await tryServerConvert(file, '/api/convert/word-to-pdf', 'pdf', onProgress);
  if (serverSuccess) return;

  // Browser-based fallback via WebAssembly @docmentis/udoc-viewer + jsPDF
  let client = null;
  let viewer = null;

  try {
    onProgress('Initializing built-in WebAssembly document engine...');
    client = await UDocClient.create({ googleFonts: true });
    viewer = await client.createViewer({});

    onProgress('Loading Word document into browser engine...');
    await viewer.load(file);

    const count = viewer.pageCount;
    if (!count || count === 0) {
      throw new Error('No pages found in the document.');
    }

    onProgress(`Rendering ${count} page${count > 1 ? 's' : ''} at high resolution...`);

    let doc = null;
    const scale = 2;

    for (let i = 0; i < count; i++) {
      onProgress(`Rendering page ${i + 1} of ${count}...`);

      const pageInfo = await viewer.getPageInfo(i);
      const widthPt = pageInfo.width;
      const heightPt = pageInfo.height;

      const blob = await viewer.renderPage(i, { scale, format: 'blob', force: true });
      const imgDataUrl = await blobToDataUrl(blob);
      const orientation = widthPt > heightPt ? 'landscape' : 'portrait';

      if (i === 0) {
        doc = new jsPDF({
          orientation,
          unit: 'pt',
          format: [widthPt, heightPt],
          compress: true,
        });
      } else {
        doc.addPage([widthPt, heightPt], orientation);
      }

      doc.addImage(imgDataUrl, 'JPEG', 0, 0, widthPt, heightPt, undefined, 'FAST');
    }

    onProgress('Finalizing PDF document...');
    const pdfBlob = doc.output('blob');
    const baseName = (file.name || 'document').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
    triggerDownload(pdfBlob, `${baseName}.pdf`);

  } catch (error) {
    console.error('[wordConverter] WebAssembly conversion error:', error);
    throw new Error(error.message || 'Word to PDF conversion failed');
  } finally {
    if (viewer) try { viewer.destroy(); } catch (e) {}
    if (client) try { client.destroy(); } catch (e) {}
  }
}

/**
 * PDF to Word Converter
 *
 * mode = 'text'  (default) → extract real editable text, headings, bold, bullets
 * mode = 'image'           → embed high-res page screenshots (visual layout)
 *
 * Strategy:
 *  1) Try server engine first  (/api/convert/pdf-to-word)
 *  2) Fall back to browser: structured text extraction → docx
 *  3) If a page has no extractable text → embed canvas screenshot
 */
export async function convertPdfToWord(file, onProgress, mode = 'text') {
  // ── 1. Try the server high-fidelity path first ────────────────────────────
  onProgress('Checking for high-fidelity server engine...');
  const serverSuccess = await tryServerConvert(file, '/api/convert/pdf-to-word', 'docx', onProgress);
  if (serverSuccess) return;

  // ── 2. Browser fallback ───────────────────────────────────────────────────
  onProgress('Loading PDF document into browser engine...');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  if (!numPages || numPages === 0) throw new Error('No pages found in PDF.');

  if (mode === 'image') {
    return await convertPdfToWordImageMode(file, pdf, numPages, onProgress);
  }

  // ── 3. Text / Structure mode ──────────────────────────────────────────────
  return await convertPdfToWordTextMode(file, pdf, numPages, onProgress);
}

// ─── IMAGE MODE ─────────────────────────────────────────────────────────────

async function convertPdfToWordImageMode(file, pdf, numPages, onProgress) {
  onProgress(`Rendering ${numPages} page${numPages > 1 ? 's' : ''} at high resolution...`);
  const children = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress(`Converting page ${pageNum} of ${numPages} to image...`);
    const { uint8Array, displayW, displayH } = await renderPageToImageBuffer(pdf, pageNum);

    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            type: 'png',
            data: uint8Array,
            transformation: {
              width: displayW,
              height: displayH,
            },
          }),
        ],
        spacing: { before: 0, after: 0 },
        pageBreakBefore: pageNum > 1,
      })
    );
  }

  onProgress('Finalizing .docx document...');
  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 0, right: 0, bottom: 0, left: 0 } },
      },
      children,
    }],
  });

  const docBlob = await Packer.toBlob(doc);
  const baseName = (file.name || 'document').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
  triggerDownload(docBlob, `${baseName}.docx`);
}

// ─── TEXT / STRUCTURE MODE ───────────────────────────────────────────────────

async function convertPdfToWordTextMode(file, pdf, numPages, onProgress) {
  onProgress('Extracting text and document structure from PDF...');

  // Collect all structured content using extractStructuredContent approach per page
  const allPageLines = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress(`Analysing page ${pageNum} of ${numPages}...`);
    const page = await pdf.getPage(pageNum);
    const pageLines = await extractPageLines(page);
    allPageLines.push({ pageNum, lines: pageLines, hasText: pageLines.length > 0 });
  }

  // Classify lines to assign heading/bullet/body roles
  const allFlatLines = [];
  for (const pg of allPageLines) {
    // Stamp each line with its page number before flattening
    for (const line of pg.lines) {
      allFlatLines.push({ ...line, page: pg.pageNum });
    }
    if (pg.pageNum < numPages) allFlatLines.push({ pageBreak: true, page: pg.pageNum });
  }
  const classified = classifyLines(allFlatLines);

  // Build numbering definition for bullet + numbered lists
  const numberingConfig = {
    config: [
      {
        reference: 'bullet-list',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: { indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.25) } },
            },
          },
        ],
      },
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
  };

  onProgress('Building editable Word document...');
  const children = [];

  for (let i = 0; i < classified.length; i++) {
    const line = classified[i];

    // Page break
    if (line.pageBreak) {
      children.push(new Paragraph({ pageBreakBefore: true, children: [] }));
      continue;
    }

    // Scanned page fallback — image embed
    const pg = allPageLines[line.page - 1];
    if (pg && !pg.hasText) {
      onProgress(`Page ${line.page} appears scanned — embedding image...`);
      const { uint8Array, displayW, displayH } = await renderPageToImageBuffer(pdf, line.page);
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              type: 'png',
              data: uint8Array,
              transformation: {
                width: displayW,
                height: displayH,
              },
            }),
          ],
        })
      );
      continue;
    }

    const para = buildParagraph(line);
    if (para) children.push(para);
  }

  if (children.length === 0) {
    // All pages are scanned / image-only — automatically switch to image mode
    onProgress('No text found — this PDF appears to be scanned. Switching to image mode...');
    return await convertPdfToWordImageMode(file, pdf, numPages, onProgress);
  }

  onProgress('Finalizing and packing .docx file...');
  const doc = new Document({
    numbering: numberingConfig,
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
        },
      },
      children,
    }],
  });

  const docBlob = await Packer.toBlob(doc);
  const baseName = (file.name || 'document').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
  triggerDownload(docBlob, `${baseName}.docx`);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Extract text lines from a single PDF page using pdfjs */
async function extractPageLines(page) {
  const textContent = await page.getTextContent({ includeMarkedContent: false });
  const viewport = page.getViewport({ scale: 1 });
  const styles = textContent.styles || {};
  const lineMap = new Map();

  for (const item of textContent.items) {
    if (typeof item.str === 'undefined' || item.str.trim() === '') continue;

    const y = Math.round(viewport.height - item.transform[5]);
    const x = Math.round(item.transform[4]);
    const fontSize = Math.round(Math.hypot(item.transform[0], item.transform[1])) ||
                     Math.round(Math.abs(item.height)) || 11;
    const width = item.width ? Math.round(item.width) : Math.round(item.str.length * fontSize * 0.5);

    const styleEntry = styles[item.fontName] || {};
    const resolvedFontFamily = (styleEntry.fontFamily || item.fontName || '').toLowerCase();
    const isBold = resolvedFontFamily.includes('bold') || resolvedFontFamily.includes('heavy') || resolvedFontFamily.includes('black');
    const isItalic = resolvedFontFamily.includes('italic') || resolvedFontFamily.includes('oblique');

    let lineKey = null;
    for (const k of lineMap.keys()) {
      if (Math.abs(k - y) <= 3) { lineKey = k; break; }
    }
    if (lineKey === null) { lineKey = y; lineMap.set(lineKey, []); }
    lineMap.get(lineKey).push({ text: item.str, x, width, fontSize, isBold, isItalic });
  }

  const sortedKeys = [...lineMap.keys()].sort((a, b) => a - b);
  const lines = [];

  for (const key of sortedKeys) {
    const items = lineMap.get(key).sort((a, b) => a.x - b.x);
    const minX = items[0].x;
    const maxFontSize = Math.max(...items.map(i => i.fontSize));
    const boldCount = items.filter(i => i.isBold).length;
    const allBold = boldCount > items.length / 2;
    const allItalic = items.every(i => i.isItalic);

    // Reconstruct runs with proper spacing between items
    let fullText = '';
    const processedRuns = [];
    for (let i = 0; i < items.length; i++) {
      const cur = items[i];
      let str = cur.text;
      if (i > 0) {
        const prev = items[i - 1];
        const prevRight = prev.x + (prev.width || (prev.text.length * prev.fontSize * 0.5));
        const gap = cur.x - prevRight;
        if (gap > Math.max(2, prev.fontSize * 0.2) && !prev.text.endsWith(' ') && !str.startsWith(' ')) {
          str = ' ' + str;
        }
      }
      fullText += str;
      processedRuns.push({ ...cur, text: str });
    }

    const text = fullText.replace(/\s+/g, ' ').trim();
    if (!text) continue;
    lines.push({ text, fontSize: maxFontSize, isBold: allBold, isItalic: allItalic, x: minX, page: null, runs: processedRuns });
  }

  return lines;
}

/** Build a docx Paragraph from a classified line */
function buildParagraph(line) {
  const { text, role, fontSize, isBold, isItalic, runs, indent } = line;

  const halfPoints = Math.round((fontSize || 11) * 2);

  const makeRun = (runText, bold, italic, size) =>
    new TextRun({
      text: runText,
      bold: bold || false,
      italics: italic || false,
      size: Math.max(16, Math.round((size || fontSize || 11) * 2)),
    });

  // Build inline runs preserving per-run bold/italic where available
  const inlineRuns = (runs && runs.length > 1)
    ? runs.map(r => makeRun(r.text, r.isBold, r.isItalic, r.fontSize))
    : [makeRun(text, isBold, isItalic, fontSize)];

  switch (role) {
    case 'heading1':
      return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: inlineRuns,
        spacing: { before: 240, after: 120 },
      });

    case 'heading2':
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: inlineRuns,
        spacing: { before: 200, after: 100 },
      });

    case 'heading3':
      return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        children: inlineRuns,
        spacing: { before: 160, after: 80 },
      });

    case 'bullet':
      return new Paragraph({
        numbering: { reference: 'bullet-list', level: 0 },
        children: inlineRuns,
        spacing: { before: 40, after: 40 },
      });

    case 'numberedBullet':
      return new Paragraph({
        numbering: { reference: 'numbered-list', level: 0 },
        children: inlineRuns,
        spacing: { before: 40, after: 40 },
      });

    case 'indented':
      return new Paragraph({
        indent: { left: convertInchesToTwip(Math.min(indent / 72, 2)) },
        children: inlineRuns,
        spacing: { before: 60, after: 60 },
      });

    case 'body':
    default:
      return new Paragraph({
        children: inlineRuns,
        spacing: { before: 80, after: 80 },
      });
  }
}

/** Render a PDF page to a uint8Array PNG buffer for image embedding in docx.
 *
 *  docx ImageRun transformation.width/height = pixels at 96 DPI
 *  (the library multiplies by 9525 EMU/px internally)
 *
 *  PDF viewport.width at scale 1.0 = PDF points (1pt = 1/72 inch)
 *  → pixels at 96 DPI = points × (96/72) = points × 4/3
 *
 *  We clamp to max 624px wide (6.5-inch content area at 96 DPI) so the
 *  image stays within the printable area of a standard Word page.
 */
async function renderPageToImageBuffer(pdf, pageNum) {
  const page = await pdf.getPage(pageNum);
  const origViewport = page.getViewport({ scale: 1.0 });

  // Convert PDF points → pixels at 96 DPI
  const ptToPixel = 96 / 72; // ≈ 1.333
  const naturalW = origViewport.width * ptToPixel;
  const naturalH = origViewport.height * ptToPixel;

  // Clamp to Word's 6.5-inch (624px) content width
  const MAX_WIDTH_PX = 624;
  const scale = Math.min(1, MAX_WIDTH_PX / naturalW);
  const displayW = Math.round(naturalW * scale);
  const displayH = Math.round(naturalH * scale);

  // Render at 2× for sharpness
  const renderScale = (2 * displayW) / origViewport.width;
  const viewport = page.getViewport({ scale: renderScale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;

  const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
  const buffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  // Return display dimensions (pixels), not raw canvas size
  return { uint8Array, displayW, displayH };
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read page image data'));
    reader.readAsDataURL(blob);
  });
}
