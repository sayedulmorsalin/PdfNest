/**
 * PDF.js Worker Setup
 *
 * Using Vite's `?url` import to resolve the worker path at BUILD TIME.
 * This produces a content-hashed URL (e.g. /assets/pdf.worker-abc123.mjs)
 * that Netlify/Vercel serve as a proper JS asset with the correct MIME type.
 *
 * The old approach of `workerSrc = '/pdf.worker.min.mjs'` fails on some hosts
 * (Netlify in particular) because .mjs files may not be served with the
 * `application/javascript` Content-Type required for ES module workers.
 */
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let workerConfigured = false;

export function configurePdfWorker() {
  if (!workerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    workerConfigured = true;
  }
}

export { pdfjsLib };
