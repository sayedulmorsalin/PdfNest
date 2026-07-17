import { useState } from 'react';
import { FileUp, Info, FileText } from 'lucide-react';

export default function PdfToWordTool() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploaded = e.dataTransfer.files[0];
    if (uploaded && uploaded.type === 'application/pdf') {
      setFile(uploaded);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!file ? (
        <label
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <FileText className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <span className="text-lg font-semibold text-white mb-1">Upload PDF File</span>
          <span className="text-sm text-muted-foreground">Select PDF to convert to Word document</span>
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
            onClick={() => { setFile(null); }}
            className="text-xs text-red-400 hover:underline"
          >
            Remove file
          </button>
        </div>
      )}

      {file && (
        <div className="p-6 bg-zinc-900 border border-white/10 rounded-xl flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 text-amber-400">
            <Info className="w-5 h-5 shrink-0" />
            <span className="text-sm">Advanced PDF to Word conversion is currently under development. Stay tuned!</span>
          </div>
          <button
            disabled
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl opacity-50 cursor-not-allowed transition-all shadow-lg shadow-primary/20 text-sm shrink-0"
          >
            <FileText className="w-4 h-4" />
            Coming Soon
          </button>
        </div>
      )}
    </div>
  );
}
