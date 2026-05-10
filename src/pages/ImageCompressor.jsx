import { useState, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, RotateCcw, Sliders, Zap, AlertCircle } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import SEO from '../components/SEO';

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setSelectedFile(file);
      setOriginalImage(URL.createObjectURL(file));
      setCompressedImage(null);
      setCompressedFile(null);
      setStats(null);
      setError('');
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }
    setLoading(true);
    setError('');

    const options = {
      maxSizeMB: 5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: quality,
    };

    try {
      const compressedFileResult = await imageCompression(selectedFile, options);
      const compressedObjectUrl = URL.createObjectURL(compressedFileResult);
      setCompressedImage(compressedObjectUrl);
      setCompressedFile(compressedFileResult);
      
      const originalSize = selectedFile.size;
      const compressedSize = compressedFileResult.size;
      const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      setStats({
        originalSize: formatFileSize(originalSize),
        compressedSize: formatFileSize(compressedSize),
        reduction: reduction,
        saved: formatFileSize(originalSize - compressedSize)
      });
    } catch (err) {
      setError(`Compression failed: ${err.message || 'Unknown error'}`);
      console.error('Compression error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile || !selectedFile) {
      setError('No compressed image available');
      return;
    }
    
    const link = document.createElement('a');
    const fileName = selectedFile.name.split('.')[0];
    const extension = selectedFile.name.split('.').pop();
    link.href = URL.createObjectURL(compressedFile);
    link.download = `${fileName}_compressed.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalImage(null);
    setCompressedImage(null);
    setCompressedFile(null);
    setStats(null);
    setError('');
    setQuality(0.8);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SEO 
        title="Image Compressor" 
        description="Fast, client-side image compression. Reduce file sizes without losing quality. No server uploads - your privacy is guaranteed."
        canonical="/image-compressor"
      />

      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400">
          <ImageIcon className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Image Compressor</h1>
          <p className="text-muted-foreground text-sm">Efficient client-side image compression. 100% private - no uploads.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload and Controls */}
        <div className="lg:col-span-1 space-y-6">
          <label className="glass p-8 rounded-3xl border-dashed border-2 border-white/10 hover:border-emerald-400/50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer relative group">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-bold mb-1">Upload Image</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP supported</p>
            {selectedFile && <p className="text-xs text-emerald-400 mt-2">✓ {selectedFile.name}</p>}
          </label>

          <div className="glass p-6 rounded-3xl space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" /> Quality
                </label>
                <span className="text-xs font-mono text-emerald-400">{Math.round(quality * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.1" 
                value={quality} 
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
            
            <button
              onClick={handleCompress}
              disabled={!selectedFile || loading}
              className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-5 h-5 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> Compress Now
                </>
              )}
            </button>

            {(selectedFile || stats) && (
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-xl glass border border-white/10 text-muted-foreground font-bold hover:bg-white/5 transition-all"
              >
                Reset
              </button>
            )}
          </div>

          {stats && (
            <div className="glass p-6 rounded-3xl space-y-4 animate-in zoom-in-95 duration-300">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Results</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Original Size</p>
                  <p className="font-mono text-sm">{stats.originalSize}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Compressed Size</p>
                  <p className="font-mono text-sm text-emerald-400">{stats.compressedSize}</p>
                </div>
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[10px] text-muted-foreground uppercase mb-1">Space Saved</p>
                  <p className="font-mono text-sm text-emerald-300">{stats.saved}</p>
                </div>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm font-bold">Reduction</span>
                  <span className="text-lg font-black text-emerald-400">{stats.reduction}%</span>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 font-bold hover:bg-emerald-400/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="glass rounded-3xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-white/5 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                Original Preview
              </div>
              <div className="flex-grow min-h-[400px] flex items-center justify-center p-4 bg-checkered">
                {originalImage ? (
                  <img src={originalImage} alt="Original" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl" />
                ) : (
                  <div className="text-muted-foreground/40 italic text-sm">Upload an image to preview</div>
                )}
              </div>
            </div>

            <div className="glass rounded-3xl overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-white/5 bg-white/5 text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex justify-between items-center">
                <span>Compressed Preview</span>
                {compressedImage && <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-400/10">✓ Done</span>}
              </div>
              <div className="flex-grow min-h-[400px] flex items-center justify-center p-4 bg-checkered">
                {compressedImage ? (
                  <img src={compressedImage} alt="Compressed" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-2xl" />
                ) : (
                  <div className="text-muted-foreground/40 italic text-sm">Compressed image will appear here</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
