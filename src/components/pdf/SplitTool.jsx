import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Scissors, FileUp, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function SplitTool() {
  const [file, setFile] = useState(null);
  const [range, setRange] = useState('');
  const [splitMode, setSplitMode] = useState('range'); // 'range' | 'all'
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

  // Helper to parse page range strings (e.g., "1-3, 5")
  const parsePageRange = (rangeStr, maxPages) => {
    const pages = new Set();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > maxPages || end > maxPages) {
          throw new Error(`Invalid range: ${trimmed}`);
        }

        const min = Math.min(start, end);
        const max = Math.max(start, end);
        for (let i = min; i <= max; i++) {
          pages.add(i - 1); // 0-indexed internally
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > maxPages) {
          throw new Error(`Invalid page number: ${trimmed}`);
        }
        pages.add(pageNum - 1); // 0-indexed internally
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Processing PDF document...' });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const totalPages = sourcePdf.getPageCount();

      if (splitMode === 'range') {
        if (!range.trim()) {
          setStatus({ type: 'error', message: 'Please enter a valid page range (e.g. 1-3, 5).' });
          return;
        }

        const pageIndices = parsePageRange(range, totalPages);
        if (pageIndices.length === 0) {
          setStatus({ type: 'error', message: 'No valid pages found in range.' });
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `split_${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setStatus({ type: 'success', message: `✅ Successfully extracted ${pageIndices.length} page(s)!` });
      } else {
        // Split all pages into individual files
        setStatus({ type: 'loading', message: 'Generating individual PDF pages...' });
        
        // If there are many pages, let's zip them or trigger multiple downloads.
        // For simplicity and since we installed JSZip, we can generate a ZIP file of all pages!
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        for (let i = 0; i < totalPages; i++) {
          const singlePagePdf = await PDFDocument.create();
          const [copiedPage] = await singlePagePdf.copyPages(sourcePdf, [i]);
          singlePagePdf.addPage(copiedPage);
          const pdfBytes = await singlePagePdf.save();
          zip.file(`page_${i + 1}.pdf`, pdfBytes);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `split_pages_${file.name.replace(/\.pdf$/i, '')}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setStatus({ type: 'success', message: `✅ Successfully split ${totalPages} pages into a ZIP archive!` });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ Error splitting PDF: ${err.message}` });
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
          <Scissors className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <span className="text-lg font-semibold text-white mb-1">Upload PDF File</span>
          <span className="text-sm text-muted-foreground">Select the PDF document you want to split</span>
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
          <div className="flex gap-4 border-b border-white/10 pb-4">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="splitMode"
                checked={splitMode === 'range'}
                onChange={() => setSplitMode('range')}
                className="accent-primary"
              />
              Extract Page Range
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="splitMode"
                checked={splitMode === 'all'}
                onChange={() => setSplitMode('all')}
                className="accent-primary"
              />
              Split Every Page (Export to ZIP)
            </label>
          </div>

          {splitMode === 'range' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">Pages to extract:</label>
              <input
                type="text"
                placeholder="e.g. 1-3, 5"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enter page numbers or ranges separated by commas. E.g. "1-3, 5" extracts pages 1, 2, 3, and 5.
              </p>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSplit}
              disabled={status.type === 'loading'}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-primary/20 cursor-pointer text-sm"
            >
              <Scissors className="w-4 h-4" />
              Split PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
