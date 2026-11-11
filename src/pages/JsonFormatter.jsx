import { useState } from 'react';
import { FileJson, Wand2, Trash2, Copy, Check, Minimize2 } from 'lucide-react';
import SEO, { buildFAQSchema } from '../components/SEO';
import FAQSection from '../components/FAQSection';
import RelatedTools from '../components/RelatedTools';

const faqs = [
  {
    q: "What is JSON?",
    a: "JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write, and easy for machines to parse and generate. It is heavily used in web development for sending data between a server and a client."
  },
  {
    q: "Why should I format my JSON data?",
    a: "Raw JSON data often comes minified (compressed into a single line) to save bandwidth, making it incredibly difficult to read. Formatting (or beautifying) JSON adds proper indentation, line breaks, and spacing, allowing developers to easily read the structure, spot errors, and understand the data hierarchy."
  },
  {
    q: "Is my JSON data secure when using this tool?",
    a: "Yes, 100% secure. PdfNest's JSON Formatter processes your data entirely on the client-side (in your browser). Your JSON data is never uploaded, saved, or transmitted to any server."
  },
  {
    q: "What does minifying JSON mean?",
    a: "Minifying JSON is the opposite of formatting. It removes all unnecessary whitespace, line breaks, and indentation from the JSON string. This reduces the file size, making it faster to transmit over the network in production environments."
  },
  {
    q: "How does the JSON validator work?",
    a: "Our tool automatically attempts to parse the JSON you paste in real-time. If the JSON is valid, a green 'Valid JSON' badge appears. If there is a syntax error (like a missing comma or unmatched bracket), the tool will catch the error and display exactly what went wrong when you attempt to format or minify it."
  }
];

export default function JsonFormatter() {
  const [code, setCode] = useState('{\n  "name": "PdfNest"\n}');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isValidJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
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
    } catch {
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
        schemas={[
          {
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
          },
          buildFAQSchema(faqs)
        ]}
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

      {/* SEO Content Section */}
      <section className="mt-16 pt-16 border-t border-white/5">
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-white mb-6">Online JSON Formatter and Validator</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Working with JSON data is a fundamental part of modern web and software development. However, APIs and databases often output JSON as a single, minified string that is nearly impossible for humans to read. 
            PdfNest's <strong>JSON Formatter and Validator</strong> solves this problem instantly by beautifying your code with proper indentation, making it readable and easy to debug.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-blue-400" /> Beautify JSON
              </h3>
              <p className="text-muted-foreground text-sm">
                Paste your messy, compressed, or unformatted JSON data into the editor. Click the "Format" button, and our tool will automatically apply strict formatting rules, adding 2-space indentation and line breaks to reveal the underlying object hierarchy and arrays.
              </p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Minimize2 className="w-5 h-5 text-purple-400" /> Minify JSON
              </h3>
              <p className="text-muted-foreground text-sm">
                Need to prepare your JSON payload for production? Our JSON minifier strips out all unnecessary whitespace, carriage returns, and line breaks. This drastically reduces the byte size of your JSON string, optimizing it for fast network transmission.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">Real-Time JSON Validation</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            A single missing comma or unescaped quote can break an entire application. Our JSON Validator runs in real-time as you paste or type your code. It utilizes strict standard JSON parsing rules to ensure your data structure is flawless. If a syntax error is detected, the formatter will catch it and display an error message explaining exactly why the JSON is invalid, allowing you to fix it before deployment.
          </p>

          <h3 className="text-2xl font-bold text-white mb-4">100% Secure & Private</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We understand that JSON data often contains sensitive information, API keys, personal user data, or proprietary configurations. 
            Unlike many other online formatting tools that send your code to a backend server, <strong>PdfNest processes your JSON entirely locally in your web browser</strong>. 
            Your data never leaves your device, ensuring complete security and privacy.
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} title="JSON Formatter — Frequently Asked Questions" />
      
      <div className="pt-8">
        <RelatedTools currentToolId="json-formatter" category="Developer Tools" />
      </div>
    </div>
  );
}
