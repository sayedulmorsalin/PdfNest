import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Merge, FileUp, ArrowUp, ArrowDown, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function MergeTool() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleFileChange = (e) => {
    const uploaded = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setFiles(prev => [...prev, ...uploaded]);
    setStatus({ type: null, message: '' });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (uploaded.length) {
      setFiles(prev => [...prev, ...uploaded]);
      setStatus({ type: null, message: '' });
    }
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      [newFiles[idx - 1], newFiles[idx]] = [newFiles[idx], newFiles[idx - 1]];
      return newFiles;
    });
  };

  const moveDown = (idx) => {
    if (idx === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      [newFiles[idx], newFiles[idx + 1]] = [newFiles[idx + 1], newFiles[idx]];
      return newFiles;
    });
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setStatus({ type: 'error', message: 'Please select at least 2 PDF files to merge.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Merging PDF documents...' });

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: '✅ PDFs successfully merged!' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ Error merging PDFs: ${err.message}` });
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
      <label
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <FileUp className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
        <span className="text-lg font-semibold text-white mb-1">Upload PDF Files</span>
        <span className="text-sm text-muted-foreground">Select multiple PDFs to merge them into one</span>
        <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="hidden" />
      </label>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Files to Merge (in order):</h3>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="p-3 bg-white/5 rounded-lg flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-mono w-5">{idx + 1}.</span>
                  <span className="text-sm text-white max-w-xs md:max-w-md truncate">📄 {file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors ml-2"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || status.type === 'loading'}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 cursor-pointer"
            >
              <Merge className="w-5 h-5" />
              Merge {files.length} PDFs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
