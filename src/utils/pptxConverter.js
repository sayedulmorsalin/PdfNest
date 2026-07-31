import { triggerDownload } from './pdfConverter';

/**
 * Convert PPTX to PDF via the serverless API endpoint.
 * On Vercel: calls /api/convert-pptx (serverless function)
 * Locally: calls the same path via Vite proxy
 */
export async function convertPptxToPdf(file, onProgress) {
  try {
    onProgress('Uploading presentation...');

    const formData = new FormData();
    formData.append('file', file);

    onProgress('Converting with high-fidelity engine...');

    const response = await fetch('/api/convert-pptx', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${response.statusText}`);
    }

    onProgress('Preparing download...');

    const pdfBlob = await response.blob();
    const baseName = (file.name || 'presentation').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
    triggerDownload(pdfBlob, `${baseName}.pdf`);

  } catch (error) {
    throw new Error(error.message || 'Conversion failed');
  }
}
