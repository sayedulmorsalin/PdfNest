import { UDocClient } from '@docmentis/udoc-viewer';
import { jsPDF } from 'jspdf';
import { triggerDownload, convertPdfToPptx as convertPdfToPptxBrowser } from './pdfConverter';
import { tryServerConvert } from './serverConverter';

/**
 * High-Fidelity PPTX to PDF Converter
 * 1) Tries local server Microsoft PowerPoint COM Automation / LibreOffice (/api/convert/pptx-to-pdf)
 * 2) Falls back to browser WebAssembly (@docmentis/udoc-viewer + jsPDF)
 */
export async function convertPptxToPdf(file, onProgress) {
  onProgress('Starting PowerPoint to PDF conversion...');

  // Try server engine first
  const serverSuccess = await tryServerConvert(file, '/api/convert/pptx-to-pdf', 'pdf', onProgress);
  if (serverSuccess) return;

  // Browser-based fallback via WebAssembly @docmentis/udoc-viewer + jsPDF
  let client = null;
  let viewer = null;

  try {
    onProgress('Initializing built-in WebAssembly PowerPoint engine...');
    client = await UDocClient.create({
      googleFonts: true,
    });

    viewer = await client.createViewer({});

    onProgress('Loading presentation into browser engine...');
    await viewer.load(file);

    const count = viewer.pageCount;
    if (!count || count === 0) {
      throw new Error('No slides found in the presentation.');
    }

    onProgress(`Rendering ${count} slide${count > 1 ? 's' : ''} at high resolution...`);

    let doc = null;
    const scale = 2;

    for (let i = 0; i < count; i++) {
      onProgress(`Rendering slide ${i + 1} of ${count}...`);

      const pageInfo = await viewer.getPageInfo(i);
      const widthPt = pageInfo.width;
      const heightPt = pageInfo.height;

      const blob = await viewer.renderPage(i, {
        scale,
        format: 'blob',
        force: true,
      });

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
    const baseName = (file.name || 'presentation').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
    triggerDownload(pdfBlob, `${baseName}.pdf`);

  } catch (error) {
    console.error('[pptxConverter] WebAssembly conversion error:', error);
    throw new Error(error.message || 'PowerPoint conversion failed');
  } finally {
    if (viewer) {
      try { viewer.destroy(); } catch (e) { /* ignore */ }
    }
    if (client) {
      try { client.destroy(); } catch (e) { /* ignore */ }
    }
  }
}

/**
 * High-Fidelity PDF to PPTX Converter
 * 1) Tries local server LibreOffice Impress / Office COM (/api/convert/pdf-to-pptx)
 * 2) Falls back to browser PptxGenJS text hierarchy extraction
 */
export async function convertPdfToPptx(file, onProgress) {
  onProgress('Starting PDF to PowerPoint conversion...');

  // Try server engine first
  const serverSuccess = await tryServerConvert(file, '/api/convert/pdf-to-pptx', 'pptx', onProgress);
  if (serverSuccess) return;

  // Browser-based fallback
  return convertPdfToPptxBrowser(file, onProgress);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read slide image data'));
    reader.readAsDataURL(blob);
  });
}
