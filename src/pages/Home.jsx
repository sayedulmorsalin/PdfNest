import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import SEO from '../components/SEO';
import { ALL_TOOLS } from '../components/RelatedTools';

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(ALL_TOOLS.map(t => t.category))];

  const filteredTools = ALL_TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                         tool.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <SEO 
        title="PdfNest | Free Online PDF Editor, JSON Formatter & Developer Tools"
        description="PdfNest is your ultimate hub for free online tools. Professional PDF editor to convert PDF to Word, merge & split PDFs, JSON formatter, Image compressor, and more. 100% private and secure."
        keywords="free PDF editor, convert PDF to Word, merge PDF, split PDF, compress PDF, JSON formatter, image compressor, CGPA calculator, online developer tools, pdfnest.shop"
        canonical="/"
        includeWebsite={true}
      />
      
      {/* Hero Section */}
      <section className="text-center py-16 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase"
        >
          <Sparkles className="w-3 h-3" />
          <span>The Ultimate Utility Hub</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          All your tools in <span className="text-primary italic">one place.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
        >
          Fast, free, and privacy-focused online tools for developers and students. 
          No accounts, no tracking, just pure utility.
        </motion.p>
      </section>

      {/* Ad Placeholder Top */}
      <div className="w-full h-24 glass rounded-xl flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest border-dashed border-white/10">
        Advertisement
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass border-white/5 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'glass text-muted-foreground hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              to={tool.path}
              className="group block p-6 rounded-2xl glass-card relative h-full flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-grow">{tool.shortDescription}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold px-2 py-1 rounded bg-white/5">
                  {tool.category}
                </span>
                <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No tools found matching your search.</p>
        </div>
      )}

      {/* Blog Promo */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto glass p-8 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-primary font-semibold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>PdfNest Blog</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Learn PDF Tips & Tricks</h3>
            <p className="text-muted-foreground">
              Read our latest guides on how to compress, convert, and edit PDF files effectively.
            </p>
          </div>
          <Link
            to="/blog"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all whitespace-nowrap shadow-lg shadow-primary/20"
          >
            Read the Blog
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about PdfNest and our tools.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How to compress PDF without losing quality?",
                a: "Our PDF compressor uses advanced algorithms to remove redundant data and optimize images within the file. By choosing 'Recommended Compression', you get the perfect balance between file size reduction and visual quality."
              },
              {
                q: "What is the best PDF format for printing?",
                a: "For high-quality printing, PDF/X is generally the best choice as it ensures all fonts are embedded and colors are correctly defined. However, our standard PDF output is optimized for both digital viewing and standard office printing."
              },
              {
                q: "How to convert JPG to PDF?",
                a: "You can use our Image Compressor or PDF Editor tools. Simply upload your JPG files, and you can export them as a single, multi-page PDF document in seconds. All processing happens locally in your browser."
              },
              {
                q: "Is PdfNest safe and private?",
                a: "Yes! PdfNest is built with a 'Privacy First' philosophy. Your files are processed locally using JavaScript in your browser. This means your sensitive documents never leave your computer and are never uploaded to any server."
              },
              {
                q: "Do I need to create an account or pay?",
                a: "No. PdfNest is 100% free and requires no registration. You have full access to all our tools—including PDF editing, JSON formatting, and image compression—without any hidden costs or accounts."
              }
            ].map((faq, i) => (
              <div 
                key={i} 
                className="glass p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group"
              >
                <details className="cursor-pointer">
                  <summary className="text-lg font-semibold list-none flex justify-between items-center text-white group-open:text-primary transition-colors">
                    {faq.q}
                    <span className="text-primary group-open:rotate-180 transition-transform">
                      <ArrowRight className="w-5 h-5 rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2">
                    {faq.a}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Placeholder Bottom */}
      <div className="w-full h-32 glass rounded-2xl flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest border-dashed border-white/10 mt-12">
        Advertisement
      </div>
    </div>
  );
}
