import { useState } from 'react';
import { FileUp, CheckCircle, AlertCircle, Loader, FileText } from 'lucide-react';
import { convertWordToPdf } from '../../utils/wordConverter';

export default function WordToPdfTool() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && (uploaded.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || uploaded.name.endsWith('.docx') || uploaded.name.endsWith('.doc'))) {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded && (uploaded.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || uploaded.name.endsWith('.docx') || uploaded.name.endsWith('.doc'))) {
      setFile(uploaded);
      setStatus({ type: null, message: '' });
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a Word document first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Starting Word to PDF conversion...' });

    try {
      await convertWordToPdf(file, msg => setStatus({ type: 'loading', message: msg }));
      setStatus({ type: 'success', message: '✅ PDF downloaded successfully!' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ Error converting Word to PDF: ${err.message}` });
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
          <FileText className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <span className="text-lg font-semibold text-white mb-1">Upload Word Document</span>
          <span className="text-sm text-muted-foreground">Select a .docx or .doc file to convert to PDF</span>
          <input type="file" accept=".docx,.doc" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
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
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl flex justify-between items-center gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Ready to convert</h4>
            <p className="text-xs text-muted-foreground">
              Converts Word tables, headings, fonts, and styles to high-fidelity PDF.
            </p>
          </div>
          <button
            onClick={handleConvert}
            disabled={status.type === 'loading'}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 text-sm shrink-0"
          >
            {status.type === 'loading' ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileUp className="w-4 h-4" />
                Convert to PDF
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
