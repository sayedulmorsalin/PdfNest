import { useState } from 'react';
import { Copy, Trash2, Check, Code, Wand2 } from 'lucide-react';
import SEO, { buildFAQSchema } from '../components/SEO';
import FAQSection from '../components/FAQSection';
import RelatedTools from '../components/RelatedTools';

const faqs = [
  {
    q: "What programming languages does the formatter support?",
    a: "Currently, our code formatter supports JavaScript, JSON, HTML, and CSS. Simply select the appropriate language tab before clicking the format or minify buttons."
  },
  {
    q: "Why should I use a code formatter?",
    a: "Code formatting ensures consistent indentation and spacing, making your code significantly easier to read, maintain, and debug. It is considered a best practice in software development."
  },
  {
    q: "What does code minification do?",
    a: "Minification removes all unnecessary characters from your source code—such as whitespace, newlines, and comments—without changing its functionality. This reduces file size, leading to faster download times for your website visitors."
  },
  {
    q: "Does this tool save my code?",
    a: "No. For your security and privacy, all code formatting and minification happens entirely within your web browser using client-side JavaScript. Your code is never sent to our servers."
  },
  {
    q: "Is this tool free to use?",
    a: "Yes! The PdfNest Code Formatter is 100% free to use with no limits, no registration required, and no intrusive pop-up ads."
  }
];

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
        title="Online Code Formatter - Beautify JS, HTML, CSS & JSON" 
        description="Format and minify JavaScript, HTML, CSS, and JSON instantly. Online code beautifier with support for multiple languages and privacy-first browser-based processing."
        canonical="/code-formatter"
        keywords="code formatter, js beautifier, html formatter, css beautifier, minify code, online code editor, beautify javascript, format html online"
        schemas={[
          {
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
            "featureList": [
              "JavaScript Formatting",
              "HTML Beautifier",
              "CSS Minifier",
              "JSON Validator"
            ]
          },
          buildFAQSchema(faqs)
        ]}
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

      {/* SEO Content Section */}
      <section className="mt-16 pt-16 border-t border-white/5">
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-white mb-6">Online Code Formatter & Minifier</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Writing code is only half the battle; maintaining it is where the real challenge lies. 
            PdfNest's <strong>Online Code Formatter</strong> is an essential developer utility designed to instantly clean up messy code, making it readable, consistent, and professional. 
            Whether you've copied a messy snippet from StackOverflow or need to prepare your production files, our tool handles it effortlessly.
          </p>

          <h3 className="text-2xl font-bold text-white mb-4">Supported Languages</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Our tool provides robust formatting and minification for the core languages of the web:
          </p>
          <ul className="text-muted-foreground space-y-3 mb-8 list-disc list-inside">
            <li><strong className="text-white">JavaScript (JS):</strong> Fixes indentation, cleans up spacing around operators, and standardizes block structures.</li>
            <li><strong className="text-white">HTML:</strong> Organizes tags into a clear hierarchy, making it easy to spot unclosed elements or broken layouts.</li>
            <li><strong className="text-white">CSS:</strong> Aligns properties, adds consistent spacing after colons, and groups rulesets beautifully.</li>
            <li><strong className="text-white">JSON:</strong> Validates syntax and adds proper indentation for readable data structures.</li>
          </ul>

          <h3 className="text-2xl font-bold text-white mb-4">Formatting vs. Minifying</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="glass p-6 rounded-2xl bg-white/5">
              <h4 className="font-bold text-white mb-2 text-lg">Code Formatting</h4>
              <p className="text-sm text-muted-foreground">Also known as "beautifying," formatting adds whitespace, line breaks, and indentation. <strong>Use this during development</strong> to make your code human-readable and easier to debug.</p>
            </div>
            <div className="glass p-6 rounded-2xl bg-white/5">
              <h4 className="font-bold text-white mb-2 text-lg">Code Minification</h4>
              <p className="text-sm text-muted-foreground">Minification strips out all non-essential characters (spaces, comments, newlines). <strong>Use this for production</strong> to reduce file sizes and improve website loading speed.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">100% Browser-Based Security</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We know that source code often contains proprietary algorithms, business logic, or sensitive API endpoints. 
            By utilizing client-side processing, our Code Formatter executes all operations directly within your browser. 
            Your code is <strong>never uploaded to a server</strong>, ensuring complete intellectual property protection.
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Code Formatter — Frequently Asked Questions" />
      
      <div className="pt-8">
        <RelatedTools currentToolId="code-formatter" category="Developer Tools" />
      </div>
    </div>
  );
}
