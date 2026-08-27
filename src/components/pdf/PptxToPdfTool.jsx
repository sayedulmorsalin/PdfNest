import { useState, useCallback, useRef } from 'react';
import { FileUp, CheckCircle, AlertCircle, Loader, Presentation, X, Download, RefreshCw } from 'lucide-react';
import { convertPptxToPdf } from '../../utils/pptxConverter';

export default function PptxToPdfTool() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const fileInputRef = useRef(null);

  const isValidFile = (f) => {
    return f && (
      f.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      f.name.endsWith('.pptx') ||
      f.name.endsWith('.ppt')
    );
  };

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (isValidFile(uploaded)) {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
      setConvertedUrl(null);
      setProgress(0);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const uploaded = e.dataTransfer.files[0];
    if (isValidFile(uploaded)) {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
      setConvertedUrl(null);
      setProgress(0);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const resetAll = () => {
    setFile(null);
    setStatus({ type: null, message: '' });
    setProgress(0);
    if (convertedUrl) {
      window.URL.revokeObjectURL(convertedUrl);
    }
    setConvertedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConvert = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a PowerPoint file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Starting conversion...' });
    setProgress(10);

    try {
      await convertPptxToPdf(file, (msg) => {
        setStatus({ type: 'loading', message: msg });
        // Estimate progress from message
        if (msg.includes('Loading')) setProgress(20);
        else if (msg.includes('Rendering slide')) {
          const match = msg.match(/slide (\d+) of (\d+)/);
          if (match) {
            const current = parseInt(match[1]);
            const total = parseInt(match[2]);
            setProgress(20 + Math.round((current / total) * 70));
          }
        }
        else if (msg.includes('Saving')) setProgress(95);
      });

      setProgress(100);
      setStatus({ type: 'success', message: 'Conversion complete! Your PDF has been downloaded.' });
    } catch (err) {
      console.error(err);
      setProgress(0);
      setStatus({ type: 'error', message: err.message });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {status.type && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border text-sm transition-all duration-300 ${status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
            status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
              'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
          {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
          {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{status.message}</span>
        </div>
      )}

      {/* Progress Bar */}
      {status.type === 'loading' && progress > 0 && (
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <label
          className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 group ${isDragOver
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-white/20 hover:border-primary/50 hover:bg-white/[0.02]'
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${isDragOver ? 'bg-primary/20 scale-110' : 'bg-white/5 group-hover:bg-primary/10'
            }`}>
            <Presentation className={`w-8 h-8 transition-colors duration-300 ${isDragOver ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
              }`} />
          </div>
          <span className="text-lg font-semibold text-white mb-2">
            {isDragOver ? 'Drop your file here' : 'Upload PowerPoint Presentation'}
          </span>
          <span className="text-sm text-muted-foreground mb-4">
            Drag & drop or click to select a .pptx file
          </span>
          <span className="text-xs text-muted-foreground/60">100% browser-based · No upload to servers</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,.ppt"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <Presentation className="w-6 h-6 text-orange-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate max-w-md">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-red-400 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {file && (
        <div className="flex items-center gap-3 justify-end">
          {status.type === 'success' ? (
            <button
              onClick={resetAll}
              className="flex items-center gap-2 px-5 py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all text-sm cursor-pointer border border-white/10"
            >
              <RefreshCw className="w-4 h-4" />
              Convert Another
            </button>
          ) : (
            <button
              onClick={handleConvert}
              disabled={status.type === 'loading'}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 cursor-pointer text-sm"
            >
              <FileUp className="w-4 h-4" />
              Convert to PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
