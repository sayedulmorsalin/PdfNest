import * as pdfjsLib from 'pdfjs-dist';
import PptxGenJS from 'pptxgenjs';

// ─── PDF Text Extraction (same pattern as CompressTool — proven to work) ─────────

export async function extractStructuredContent(file) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
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

      const styleEntry = styles[item.fontName] || {};
      const resolvedFontFamily = (styleEntry.fontFamily || item.fontName || '').toLowerCase();
      const isBold = resolvedFontFamily.includes('bold') || resolvedFontFamily.includes('heavy') || resolvedFontFamily.includes('black');
      const isItalic = resolvedFontFamily.includes('italic') || resolvedFontFamily.includes('oblique');

      let lineKey = null;
      for (const k of lineMap.keys()) {
        if (Math.abs(k - y) <= 3) { lineKey = k; break; }
      }
      if (lineKey === null) { lineKey = y; lineMap.set(lineKey, []); }
      lineMap.get(lineKey).push({ text: item.str, x, fontSize, isBold, isItalic });
    }

    const sortedKeys = [...lineMap.keys()].sort((a, b) => a - b);
    for (const key of sortedKeys) {
      const items = lineMap.get(key).sort((a, b) => a.x - b.x);
      const minX = items[0].x;
      const maxFontSize = Math.max(...items.map(i => i.fontSize));
      const boldCount = items.filter(i => i.isBold).length;
      const allBold = boldCount > items.length / 2;
      const allItalic = items.every(i => i.isItalic);
      const text = items.map(i => i.text).join('').replace(/\s+/g, ' ').trim();
      if (!text) continue;
      allLines.push({ text, fontSize: maxFontSize, isBold: allBold, isItalic: allItalic, x: minX, page: pageNum, runs: items });
    }

    if (pageNum < pdf.numPages) allLines.push({ pageBreak: true, page: pageNum });
  }

  return allLines;
}

export function classifyLines(lines) {
  const sizes = lines.filter(l => !l.pageBreak && l.fontSize > 0).map(l => l.fontSize);
  const sorted = [...sizes].sort((a, b) => a - b);
  const medianSize = sorted[Math.floor(sorted.length / 2)] || 11;
  const xValues = lines.filter(l => !l.pageBreak).map(l => l.x);
  const baseX = Math.min(...xValues);

  return lines.map(line => {
    if (line.pageBreak) return { ...line, role: 'pageBreak' };
    const { text, fontSize, isBold, x } = line;
    const indent = x - baseX;
    const isBullet = /^[\u2022\u2023\u25e6\u2043\u2219\-\*]\s/.test(text) || /^\d+\.\s/.test(text);
    const isNumberedBullet = /^\d+\.\s/.test(text);

    let role = 'body';
    if (fontSize >= medianSize * 1.8 || (fontSize >= medianSize * 1.4 && isBold)) role = 'heading1';
    else if (fontSize >= medianSize * 1.35 || (fontSize >= medianSize * 1.2 && isBold)) role = 'heading2';
    else if (fontSize >= medianSize * 1.15 || (fontSize > medianSize && isBold)) role = 'heading3';
    else if (isBullet) role = isNumberedBullet ? 'numberedBullet' : 'bullet';
    else if (indent > 20 && fontSize <= medianSize) role = 'indented';

    return { ...line, role, indent };
  });
}



export function triggerDownload(blob, fileName) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
}



export async function convertPdfToPptx(file, onProgress) {
  onProgress('Extracting PDF content…');
  const rawLines = await extractStructuredContent(file);
  if (!rawLines || rawLines.length === 0) {
    throw new Error('No content found in PDF. Scanned documents are not yet supported.');
  }
  const classified = classifyLines(rawLines);

  onProgress('Building PowerPoint slides…');
  const prs = new PptxGenJS();
  const PRIMARY = '2563EB', DARK = '111827', GRAY = '6B7280';

  const titleLine = classified.find(l => l.role === 'heading1' || l.role === 'heading2');
  const slide0 = prs.addSlide();
  slide0.background = { color: 'F8FAFC' };
  slide0.addText(titleLine ? titleLine.text : file.name.replace(/\.pdf$/i, ''), {
    x: 0.8, y: 1.8, w: 8.4, h: 1.4, fontSize: 40, bold: true, color: PRIMARY, align: 'center', fontFace: 'Calibri',
  });
  slide0.addShape(prs.ShapeType.rect, { x: 3.5, y: 4.0, w: 3, h: 0.06, fill: { color: PRIMARY }, line: { type: 'none' } });
  slide0.addText(new Date().toLocaleDateString(), { x: 0.8, y: 4.3, w: 8.4, h: 0.4, fontSize: 14, color: GRAY, align: 'center' });

  const contentLines = classified.filter(l => !l.pageBreak && l.role !== 'heading1');
  const LINES_PER_SLIDE = 12;
  for (let i = 0; i < contentLines.length; i += LINES_PER_SLIDE) {
    const chunk = contentLines.slice(i, i + LINES_PER_SLIDE);
    const slide = prs.addSlide();
    slide.background = { color: 'FFFFFF' };
    slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 10, h: 0.7, fill: { color: PRIMARY }, line: { type: 'none' } });
    slide.addText(`Slide ${Math.floor(i / LINES_PER_SLIDE) + 1}`, {
      x: 0.3, y: 0.1, w: 9.4, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', fontFace: 'Calibri',
    });
    let yPos = 0.9;
    for (const line of chunk) {
      if (yPos > 6.5) break;
      const isHead = line.role === 'heading2' || line.role === 'heading3';
      slide.addText(line.role === 'bullet' ? `• ${line.text.replace(/^[\u2022\-\*]\s*/, '')}` : line.text, {
        x: 0.4, y: yPos, w: 9.2, h: isHead ? 0.5 : 0.38,
        fontSize: isHead ? 18 : 13, bold: isHead || line.isBold, color: isHead ? PRIMARY : DARK,
        fontFace: 'Calibri', align: 'left',
      });
      yPos += isHead ? 0.55 : 0.42;
    }
  }

  onProgress('Saving file…');
  const pptxBlob = await prs.write({ outputType: 'blob' });
  const baseName = (file.name || 'presentation').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
  triggerDownload(pptxBlob, `${baseName}.pptx`);
}
