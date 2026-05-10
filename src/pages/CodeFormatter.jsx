import { useState } from 'react';
import { Copy, Trash2, Check, Code, Wand2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function CodeFormatter() {
  const [code, setCode] = useState('function hello() {\n  console.log("Welcome to PdfNest");\n}');
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatCode = () => {
    try {
      let formatted = code;
      
      if (language === 'javascript' || language === 'json') {
        const parsed = JSON.parse(code);
        formatted = JSON.stringify(parsed, null, 2);
      } else if (language === 'html' || language === 'xml') {
        // Simple HTML formatting
        formatted = code
          .replace(/></g, '>\n<')
          .replace(/>\n</g, '>\n  <');
      } else if (language === 'css') {
        // Simple CSS formatting
        formatted = code
          .replace(/\{/g, ' {\n  ')
          .replace(/;/g, ';\n  ')
          .replace(/\}/g, '\n}')
          .replace(/\n\s*\n/g, '\n');
      }
      
      setCode(formatted);
      setError('');
    } catch (e) {
      setError(`Error: ${e.message}`);
    }
  };

  const minifyCode = () => {
    try {
      let minified = code;
      
      // Remove whitespace and comments
      if (language === 'javascript') {
        minified = code
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      } else if (language === 'json') {
        const parsed = JSON.parse(code);
        minified = JSON.stringify(parsed);
      } else if (language === 'css' || language === 'html') {
        minified = code
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      setCode(minified);
      setError('');
    } catch (e) {
      setError(`Error: ${e.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setCode('');
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SEO 
        title="Online Code Formatter & Beautifier" 
        description="Format and minify JavaScript, HTML, CSS, and JSON instantly. Online code beautifier with support for multiple languages and privacy-first processing."
        canonical="/code-formatter"
        keywords="code formatter, js beautifier, html formatter, css beautifier, minify code, online code editor"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PdfNest Code Formatter",
          "operatingSystem": "Web",
          "applicationCategory": "DeveloperApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": "JavaScript Formatting, HTML Beautifier, CSS Minifier, JSON Validator"
        }}
      />

      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-orange-400/10 text-orange-400">
          <Code className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Code Formatter</h1>
          <p className="text-muted-foreground text-sm">Format, minify, and validate code in JavaScript, HTML, CSS, and JSON.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Language and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['javascript', 'json', 'html', 'css'].map(lang => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setError('');
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm uppercase transition-all ${
                  language === lang 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'glass text-muted-foreground hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="p-2 rounded-lg glass hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
            <button 
              onClick={clearAll}
              className="p-2 rounded-lg glass hover:bg-red-400/10 text-muted-foreground hover:text-red-400 transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="glass rounded-2xl overflow-hidden border border-white/5">
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-96 bg-black/40 p-4 font-mono text-sm outline-none resize-none text-white placeholder:text-muted-foreground/50"
            spellCheck="false"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={formatCode}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-all shadow-lg shadow-orange-500/20"
          >
            <Wand2 className="w-4 h-4" /> 
            Format
          </button>
          <button
            onClick={minifyCode}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-all shadow-lg shadow-purple-500/20"
          >
            <Wand2 className="w-4 h-4" /> 
            Minify
          </button>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl glass border border-white/5 text-sm text-muted-foreground">
          <p>💡 <strong>Tip:</strong> Select a language above, paste your code, and click Format or Minify. Supports JavaScript, JSON, HTML, and CSS.</p>
        </div>
      </div>
    </div>
  );
}
