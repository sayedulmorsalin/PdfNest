import { triggerDownload } from './pdfConverter';

const API_BASE = 'http://localhost:3001';

/**
 * Attempts to convert a file using the local backend server (Microsoft Office COM Automation / LibreOffice).
 * Returns true if successful, false if the server is offline or errors.
 */
export async function tryServerConvert(file, endpoint, expectedExt, onProgress) {
  try {
    onProgress('Connecting to high-fidelity server engine...');
    const formData = new FormData();
    formData.append('file', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server error ${response.status}`);
    }

    onProgress('Downloading converted file...');
    const blob = await response.blob();
    const baseName = (file.name || 'document').replace(/\.[^/.]+$/, '').replace(/[^a-z0-9\-_ ]/gi, '_');
    triggerDownload(blob, `${baseName}.${expectedExt}`);
    return true;
  } catch (err) {
    console.warn(`[tryServerConvert] ${endpoint} failed, switching to browser fallback:`, err.message);
    return false;
  }
}
