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
      const width = item.width ? Math.round(item.width) : Math.round(item.str.length * fontSize * 0.5);
      lineMap.get(lineKey).push({ text: item.str, x, width, fontSize, isBold, isItalic });
    }

    const sortedKeys = [...lineMap.keys()].sort((a, b) => a - b);
    for (const key of sortedKeys) {
      const items = lineMap.get(key).sort((a, b) => a.x - b.x);
      const minX = items[0].x;
      const maxFontSize = Math.max(...items.map(i => i.fontSize));
      const boldCount = items.filter(i => i.isBold).length;
      const allBold = boldCount > items.length / 2;
      const allItalic = items.every(i => i.isItalic);

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
      allLines.push({ text, fontSize: maxFontSize, isBold: allBold, isItalic: allItalic, x: minX, page: pageNum, runs: processedRuns });
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
  onProgress('Loading PDF presentation into browser engine…');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  if (!numPages || numPages === 0) {
    throw new Error('No pages found in PDF.');
  }

  onProgress(`Rendering ${numPages} page${numPages > 1 ? 's' : ''} at high resolution…`);
  const prs = new PptxGenJS();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress(`Converting page ${pageNum} of ${numPages} to PowerPoint slide…`);
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport }).promise;
    const imgDataUrl = canvas.toDataURL('image/png');

    const origViewport = page.getViewport({ scale: 1.0 });
    const isLandscape = origViewport.width > origViewport.height;

    const slide = prs.addSlide();
    slide.addImage({
      data: imgDataUrl,
      x: 0,
      y: 0,
      w: '100%',
      h: '100%',
    });
  }

  onProgress('Saving PowerPoint presentation…');
  const pptxBlob = await prs.write({ outputType: 'blob' });
  const baseName = (file.name || 'presentation').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
  triggerDownload(pptxBlob, `${baseName}.pptx`);
}
