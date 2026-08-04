import { useState } from 'react';
import { pdfjsLib, configurePdfWorker } from '../../utils/pdfWorker';
import { jsPDF } from 'jspdf';
import { FileDown, FileUp, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function CompressTool() {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('recommended'); // 'low' | 'recommended' | 'high'
  const [status, setStatus] = useState({ type: null, message: '' });
  const [resultSize, setResultSize] = useState(null);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
      setResultSize(null);
      setStatus({ type: null, message: '' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
      setResultSize(null);
      setStatus({ type: null, message: '' });
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Starting compression...' });

    try {
      // 1. Configure PDF.js worker
      configurePdfWorker();

      // 2. Load the PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      // Determine quality parameters based on compression level
      // High compression = lower resolution/quality; Low compression = higher resolution/quality
      let scale = 1.2;
      let quality = 0.6;

      if (compressionLevel === 'high') {
        scale = 0.85;
        quality = 0.45;
      } else if (compressionLevel === 'low') {
        scale = 1.8;
        quality = 0.8;
      }

      // Initialize jsPDF document
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
        compress: true // Enable jsPDF compression
      });

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setStatus({
          type: 'loading',
          message: `Compressing page ${pageNum} of ${numPages}...`
        });

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        // Render to canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const imgData = canvas.toDataURL('image/jpeg', quality);

        // Add page to PDF
        if (pageNum > 1) {
          doc.addPage();
        }

        // Set page size to match rendered size
        doc.setPage(pageNum);
        // A4 standard points: 595.28 x 841.89. We scale to fit or use rendered dimensions
        doc.addImage(imgData, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), undefined, 'FAST');
      }

      setStatus({ type: 'loading', message: 'Optimizing and saving compressed file...' });
      
      const compressedPdfBlob = doc.output('blob');
      
      // Calculate output size
      setResultSize(compressedPdfBlob.size);

      const url = URL.createObjectURL(compressedPdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: '✅ PDF compression complete!' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ Error compressing PDF: ${err.message}` });
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
          <FileDown className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <span className="text-lg font-semibold text-white mb-1">Upload PDF File</span>
          <span className="text-sm text-muted-foreground">Select the PDF document to compress</span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-md">{file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">Original: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                {resultSize && (
                  <span className="text-xs text-green-400 font-semibold">
                    Compressed: {(resultSize / 1024 / 1024).toFixed(2)} MB ({Math.round((1 - resultSize / file.size) * 100)}% reduction)
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => { setFile(null); setResultSize(null); setStatus({ type: null, message: '' }); }}
            className="text-xs text-red-400 hover:underline"
          >
            Remove file
          </button>
        </div>
      )}

      {file && (
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white block">Compression Level:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Low Compression', desc: 'Best visual quality' },
                { id: 'recommended', label: 'Recommended', desc: 'Good quality, small size' },
                { id: 'high', label: 'High Compression', desc: 'Smallest file size' }
              ].map(level => (
                <div
                  key={level.id}
                  onClick={() => setCompressionLevel(level.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    compressionLevel === level.id
                      ? 'border-primary bg-primary/5 text-white'
                      : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-bold">{level.label}</p>
                  <p className="text-xs mt-1 opacity-80">{level.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCompress}
              disabled={status.type === 'loading'}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 cursor-pointer text-sm"
            >
              <FileDown className="w-4 h-4" />
              Compress PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
