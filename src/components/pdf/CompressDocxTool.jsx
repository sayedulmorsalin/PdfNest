import { useState } from 'react';
import JSZip from 'jszip';
import { FileDown, CheckCircle, AlertCircle, Loader } from 'lucide-react';

/**
 * CompressDocxTool
 *
 * Compresses a .docx file by:
 *  1. Unpacking the ZIP archive
 *  2. Re-encoding embedded images (JPEG) at reduced quality
 *  3. Repacking with maximum deflate compression
 *
 * Everything runs locally in the browser — no files are uploaded.
 */
export default function CompressDocxTool() {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('recommended');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [resultSize, setResultSize] = useState(null);

  const accept = '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const setFileFromUpload = (f) => {
    if (f && (f.name.endsWith('.docx') || f.type.includes('wordprocessingml'))) {
      setFile(f);
      setResultSize(null);
      setStatus({ type: null, message: '' });
    } else if (f) {
      setStatus({ type: 'error', message: 'Please select a valid .docx file.' });
    }
  };

  const handleFileChange = (e) => setFileFromUpload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setFileFromUpload(e.dataTransfer.files[0]);
  };

  /** Re-encode an image blob to JPEG at the given quality (0-1) */
  const reencodeImage = (imageData, mimeType, quality) =>
    new Promise((resolve) => {
      const blob = new Blob([imageData], { type: mimeType || 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob(
          (compressed) => {
            if (!compressed || compressed.size >= imageData.byteLength) {
              resolve(imageData);
            } else {
              compressed.arrayBuffer().then(resolve);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(imageData);
      };
      img.src = url;
    });

  const handleCompress = async () => {
    if (!file) {
      setStatus({ type: 'error', message: 'Please select a .docx file first.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Reading document...' });

    try {
      const qualityMap = { low: 0.85, recommended: 0.65, high: 0.40 };
      const imageQuality = qualityMap[compressionLevel];

      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      const imageExtensions = /\.(jpe?g|png|gif|webp|bmp|tiff?)$/i;
      const fileNames = Object.keys(zip.files);
      const imageFiles = fileNames.filter(
        (name) => !zip.files[name].dir && imageExtensions.test(name)
      );

      let processed = 0;
      for (const imgName of imageFiles) {
        setStatus({
          type: 'loading',
          message: `Optimizing image ${++processed} of ${imageFiles.length}...`,
        });

        const imgData = await zip.files[imgName].async('arraybuffer');
        const lower = imgName.toLowerCase();
        const mimeType = lower.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const compressed = await reencodeImage(imgData, mimeType, imageQuality);
        zip.file(imgName, compressed, { binary: true });
      }

      setStatus({ type: 'loading', message: 'Repacking document...' });

      const compressedBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      setResultSize(compressedBlob.size);

      const url = URL.createObjectURL(compressedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compressed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: '✅ DOCX compression complete!' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `❌ Error compressing DOCX: ${err.message}` });
    }
  };

  return (
    <div className="space-y-6">
      {status.type && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg border text-sm ${
            status.type === 'loading'
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              : status.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
          {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
          {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      {!file ? (
        <label
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <FileDown className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
          <span className="text-lg font-semibold text-white mb-1">Upload DOCX File</span>
          <span className="text-sm text-muted-foreground">Select or drag & drop your Word document to compress</span>
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-md">{file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  Original: {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                {resultSize && (
                  <span className="text-xs text-green-400 font-semibold">
                    Compressed: {(resultSize / 1024 / 1024).toFixed(2)} MB (
                    {Math.round((1 - resultSize / file.size) * 100)}% reduction)
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setResultSize(null);
              setStatus({ type: null, message: '' });
            }}
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
                { id: 'high', label: 'High Compression', desc: 'Smallest file size' },
              ].map((level) => (
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
              Compress DOCX
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
