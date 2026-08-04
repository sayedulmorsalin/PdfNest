import { useState } from 'react';
import { FileUp, CheckCircle, AlertCircle, Loader, FileText, Image, AlignLeft } from 'lucide-react';
import { convertPdfToWord } from '../../utils/wordConverter';

const MODES = [
  {
    id: 'text',
    label: 'Editable Text',
    sublabel: 'Headings, bold, bullets preserved',
    icon: AlignLeft,
    recommended: true,
  },
  {
    id: 'image',
    label: 'Visual Layout',
    sublabel: 'Page images embedded as-is',
    icon: Image,
    recommended: false,
  },
];

export default function PdfToWordTool() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [mode, setMode] = useState('text');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
    } else if (uploaded) {
      setStatus({ type: 'error', message: 'Please upload a valid PDF file (.pdf).' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const uploaded = e.dataTransfer.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
    } else if (uploaded) {
      setStatus({ type: 'error', message: 'Please upload a valid PDF file (.pdf).' });
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Starting PDF to Word conversion...' });

    try {
      await convertPdfToWord(file, msg => setStatus({ type: 'loading', message: msg }), mode);
      setStatus({ type: 'success', message: '✅ Word document downloaded successfully!' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ ${err.message || 'Error converting PDF to Word.'}` });
    }
  };

  const isLoading = status.type === 'loading';

  return (
    <div className="space-y-6">

      {/* Status Banner */}
      {status.type && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border text-sm ${
          isLoading ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
          status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
          'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {isLoading && <Loader className="w-4 h-4 animate-spin shrink-0 mt-0.5" />}
          {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <span className="leading-relaxed">{status.message}</span>
        </div>
      )}

      {/* Upload Zone */}
      {!file ? (
        <label
          className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
            isDragOver
              ? 'border-primary/70 bg-primary/5 scale-[1.01]'
              : 'border-white/20 hover:border-primary/50 hover:bg-primary/5'
          }`}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div className="w-16 h-16 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-400/20 transition-colors">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <span className="text-lg font-semibold text-white mb-1">
            {isDragOver ? 'Drop your PDF here' : 'Upload PDF File'}
          </span>
          <span className="text-sm text-muted-foreground text-center max-w-xs">
            Drag & drop or click to browse. Converts to an editable Word (.docx) document.
          </span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB · PDF document
              </p>
            </div>
          </div>
          <button
            onClick={() => { setFile(null); setStatus({ type: null, message: '' }); }}
            className="text-xs text-red-400 hover:text-red-300 hover:underline shrink-0"
          >
            Remove
          </button>
        </div>
      )}

      {/* Conversion Mode Selector */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Conversion Mode
        </p>
        <div className="grid grid-cols-2 gap-3">
          {MODES.map(m => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                disabled={isLoading}
                className={`relative p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {m.recommended && (
                  <span className="absolute top-2 right-2 text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full border border-primary/30">
                    Recommended
                  </span>
                )}
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className={`text-sm font-semibold mb-0.5 ${isSelected ? 'text-white' : 'text-white/70'}`}>
                  {m.label}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">{m.sublabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Convert Button */}
      {file && (
        <div className="p-5 bg-zinc-900 border border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Ready to convert</h4>
            <p className="text-xs text-muted-foreground">
              {mode === 'text'
                ? 'Extracts headings, bold text, bullets, and paragraphs into editable Word format.'
                : 'Renders each page as a high-res image embedded into the Word document.'}
            </p>
          </div>
          <button
            onClick={handleConvert}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 text-sm shrink-0 w-full sm:w-auto justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileUp className="w-4 h-4" />
                Convert to Word
              </>
            )}
          </button>
        </div>
      )}

      {/* Info Note */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-200/80 space-y-1">
        <p className="font-semibold text-amber-200">💡 How it works</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Analyzes font sizes to detect headings vs body text</li>
          <li>Detects bold, italic, bullet points, and numbered lists</li>
          <li>Reconstructs Word styles: Heading 1, Heading 2, bullet lists</li>
          <li>Falls back to image rendering for scanned/image-only pages</li>
          <li>100% browser-based — no file uploads to servers</li>
        </ul>
      </div>
    </div>
  );
}
