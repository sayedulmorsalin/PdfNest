import { useState } from 'react';
import { pdfjsLib, configurePdfWorker } from '../../utils/pdfWorker';
import { Image, FileUp, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function PdfToJpgTool({ defaultFormat = 'jpeg' }) {
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState(defaultFormat); // 'jpeg' | 'png'
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Loading PDF document...' });

    try {
      // Configure PDF.js worker
      configurePdfWorker();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      setStatus({ type: 'loading', message: `Converting ${numPages} pages...` });

      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setStatus({
          type: 'loading',
          message: `Rendering page ${pageNum} of ${numPages}...`
        });

        const page = await pdf.getPage(pageNum);
        const scale = 2.0; // Render at 2x scale for higher quality images
        const viewport = page.getViewport({ scale });

        // Render page to canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const fileExt = format === 'png' ? 'png' : 'jpg';
        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        
        // Extract base64 content
        const base64Data = dataUrl.split(',')[1];
        zip.file(`page_${pageNum}.${fileExt}`, base64Data, { base64: true });
      }

      setStatus({ type: 'loading', message: 'Creating ZIP archive...' });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, '')}_images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: `✅ Successfully converted ${numPages} pages to images (packaged in ZIP)!` });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ Error converting PDF: ${err.message}` });
    }
  };

  return (
    <div className="space-y-6">
      {status.type && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border text-sm ${
          status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
          status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
          'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
          {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <label
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <Image className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <span className="text-lg font-semibold text-white mb-1">Upload PDF File</span>
          <span className="text-sm text-muted-foreground">Select PDF to extract its pages as images</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-md">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            onClick={() => { setFile(null); setStatus({ type: null, message: '' }); }}
            className="text-xs text-red-400 hover:underline"
          >
            Remove file
          </button>
        </div>
      )}

      {file && (
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white block">Output Format:</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="radio"
                  name="imageFormat"
                  checked={format === 'jpeg'}
                  onChange={() => setFormat('jpeg')}
                  className="accent-primary"
                />
                JPEG (Standard resolution, smaller ZIP size)
              </label>
              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="radio"
                  name="imageFormat"
                  checked={format === 'png'}
                  onChange={() => setFormat('png')}
                  className="accent-primary"
                />
                PNG (Lossless quality, larger ZIP size)
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={status.type === 'loading'}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 cursor-pointer text-sm"
            >
              <Image className="w-4 h-4" />
              Convert PDF to Images
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
