import { useState, useCallback } from 'react';
import { FileText, FileUp, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { convertPdfToWord } from '../../utils/pdfConverter';

export default function PdfToWordTool() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSet = (f) => {
    if (!f) return;
    if (f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) {
      setFile(f);
      setStatus({ type: null, message: '' });
    } else {
      setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
    }
  };

  const handleFileChange = (e) => validateAndSet(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleConvert = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Starting conversion…' });

    try {
      await convertPdfToWord(file, (msg) => setStatus({ type: 'loading', message: msg }));
      setStatus({ type: 'success', message: '✅ Word document downloaded with preserved formatting!' });
    } catch (err) {
      console.error('PDF to Word error:', err);
      let message = err.message || 'Unknown error';
      if (message.includes('No text content') || message.includes('scanned')) {
        message = 'This PDF appears to be a scanned image (not text-based). Only searchable PDFs with embedded text can be converted.';
      }
      setStatus({ type: 'error', message: `❌ ${message}` });
    }
  };

  const reset = () => {
    setFile(null);
    setStatus({ type: null, message: '' });
  };

  return (
    <div className="space-y-5">
      {/* Status Bar */}
      {status.type && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${
          status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
          status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
          'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
          {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{status.message}</span>
          <button onClick={() => setStatus({ type: null, message: '' })} className="opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <label
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging ? 'border-primary bg-primary/5' : 'border-white/20 hover:border-primary/50 hover:bg-white/2'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-lg font-semibold text-white mb-1">
            {isDragging ? 'Drop your PDF here' : 'Upload PDF File'}
          </span>
          <span className="text-sm text-muted-foreground mb-3">Click to browse or drag & drop your PDF</span>
          <span className="text-xs text-muted-foreground/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">Supports text-based PDF files</span>
          <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <span className="text-2xl">📄</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • PDF Document</p>
          </div>
          <button
            onClick={reset}
            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Action Button */}
      {file && (
        <button
          onClick={handleConvert}
          disabled={status.type === 'loading'}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 text-sm"
        >
          {status.type === 'loading' ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Converting…
            </>
          ) : (
            <>
              <FileUp className="w-4 h-4" />
              Convert to Word (.docx)
            </>
          )}
        </button>
      )}

      {/* Info Notes */}
      <div className="p-4 bg-amber-500/8 border border-amber-500/20 rounded-xl text-xs text-amber-200/80 space-y-1">
        <p className="font-semibold text-amber-200 mb-1">💡 What gets preserved</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Headings (H1, H2, H3) detected by font size</li>
          <li>Bold, italic, and bullet point formatting</li>
          <li>Paragraph structure and page breaks</li>
          <li>Numbered and bulleted lists</li>
        </ul>
      </div>

      {!file && (
        <p className="text-center text-xs text-muted-foreground/60">
          🔒 All processing happens in your browser — your files are never uploaded.
        </p>
      )}
    </div>
  );
}
