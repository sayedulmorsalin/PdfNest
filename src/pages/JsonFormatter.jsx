import { useState } from 'react';
import { FileJson, Wand2, Trash2, Copy, Check, Minimize2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function JsonFormatter() {
  const [code, setCode] = useState('{\n  "name": "PdfNest"\n}');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const formatJson = () => {
    try {
      if (!code.trim()) {
        setError('Please enter JSON data');
        return;
      }
      const parsed = JSON.parse(code);
      const formatted = JSON.stringify(parsed, null, 2);
      setCode(formatted);
      setError('');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const minifyJson = () => {
    try {
      if (!code.trim()) {
        setError('Please enter JSON data');
        return;
      }
      const parsed = JSON.parse(code);
      const minified = JSON.stringify(parsed);
      setCode(minified);
      setError('');
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const clearCode = () => {
    setCode('');
    setError('');
    setCopied(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <SEO 
        title="JSON Formatter, Validator & Beautifier" 
        description="Clean, format, minify, and validate your JSON data instantly. Online JSON beautifier with syntax highlighting, auto-validation, and privacy-focused processing." 
        canonical="/json-formatter"
        keywords="JSON formatter, JSON validator, beautify JSON, minify JSON, online JSON editor, JSON lint, validate JSON online, format JSON string"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PdfNest JSON Formatter",
          "operatingSystem": "Web",
          "applicationCategory": "DeveloperApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Format JSON data",
            "Minify JSON",
            "Validate JSON syntax",
            "Client-side processing for privacy"
          ]
        }}
      />
      
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-400/10 text-blue-400">
          <FileJson className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">JSON Formatter</h1>
          <p className="text-muted-foreground text-sm">Beautify, minify, and validate your JSON data instantly.</p>
        </div>
      </div>
      
      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">Enter JSON</label>
          {isValidJson(code) && code.trim() && <span className="text-xs bg-green-400/20 text-green-400 px-3 py-1 rounded-full">Valid JSON</span>}
        </div>
        <textarea 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your JSON here..."
          className="w-full h-64 bg-black/20 border border-white/5 rounded-xl p-4 font-mono text-sm outline-none focus:border-blue-400/30 transition-all text-white placeholder:text-muted-foreground/50"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={formatJson}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Format
        </button>
        <button 
          onClick={minifyJson}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-colors"
        >
          <Minimize2 className="w-4 h-4" />
          Minify
        </button>
        <button 
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button 
          onClick={clearCode}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
