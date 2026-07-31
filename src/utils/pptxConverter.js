import { UDocClient } from '@docmentis/udoc-viewer';
import { jsPDF } from 'jspdf';
import { triggerDownload } from './pdfConverter';

/**
 * 100% Browser-Based High-Fidelity PPTX to PDF Converter
 * Uses @docmentis/udoc-viewer WebAssembly / Rust PowerPoint engine + jsPDF.
 * Zero 3rd-party APIs, zero serverless limits, zero API keys required!
 */
export async function convertPptxToPdf(file, onProgress) {
  let client = null;
  let viewer = null;

  try {
    onProgress('Initializing built-in WebAssembly PowerPoint engine...');
    client = await UDocClient.create({
      googleFonts: true,
    });

    // Headless viewer instance (no container needed)
    viewer = await client.createViewer({});

    onProgress('Loading presentation into high-fidelity engine...');
    await viewer.load(file);

    const count = viewer.pageCount;
    if (!count || count === 0) {
      throw new Error('No slides found in the presentation.');
    }

    onProgress(`Rendering ${count} slide${count > 1 ? 's' : ''} at high resolution...`);

    let doc = null;
    // Scale 2 is ~144 DPI (2x PDF points), providing sharp slides and fast generation
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

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read slide image data'));
    reader.readAsDataURL(blob);
  });
}
