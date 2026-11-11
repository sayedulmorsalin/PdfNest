import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Sparkles, ArrowRight, ShieldCheck, Zap, 
  FileText, Merge, Scissors, FileDown, CheckCircle2, Lock, 
  Cpu, FileCheck, Layers, BookOpen, ChevronDown, ChevronUp,
  FileSpreadsheet, FileImage, Presentation
} from 'lucide-react';
import SEO from '../components/SEO';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../components/RelatedTools';
import blogPosts from '../data/blogPosts';

const faqs = [
  {
    q: 'Are my files uploaded to your servers when I use PdfNest?',
    a: 'No. PdfNest is engineered with a strict client-side architecture. All compression, PDF conversion, merging, splitting, and formatting operations occur entirely inside your browser memory using WebAssembly, Canvas APIs, and JavaScript. Your confidential files never leave your device.',
  },
  {
    q: 'Is PdfNest really 100% free with no hidden limits or watermarks?',
    a: 'Yes, completely free. There are no subscriptions, no trial periods, no email registration walls, and zero watermarks added to your downloaded files.',
  },
  {
    q: 'Can I compress large PowerPoint or Word files over 300MB?',
    a: 'Yes! Unlike cloud tools that enforce 25MB or 50MB limits and demand paid upgrades, PdfNest runs locally on your computer. As long as your device has enough RAM, you can compress heavy 100MB, 200MB, or 300MB+ decks without server timeout errors.',
  },
  {
    q: 'Does converting PDF to Word preserve my headings and bullet points?',
    a: 'Yes. Our smart PDF parsing engine analyzes text geometry, font weights, and spacing to reconstruct real H1/H2 headings, bold styling, paragraph margins, and bulleted lists in the output .docx document.',
  },
  {
    q: 'Does PdfNest work on mobile devices?',
    a: 'Yes. Our responsive web application works seamlessly on iPhones, iPads, and Android smartphones directly through modern mobile browsers like Safari, Chrome, and Firefox.',
  },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

  const popularTools = useMemo(() => ALL_TOOLS.filter(t => t.popular).slice(0, 6), []);

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const q = search.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        tool.name.toLowerCase().includes(q) || 
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const latestArticles = useMemo(() => blogPosts.slice(0, 3), []);

  return (
    <div className="space-y-24 animate-in fade-in duration-500">
      <SEO 
        title="PdfNest | Free Online PDF Editor, Compress, Convert & Merge PDFs (No Uploads)"
        description="Merge, compress, convert, edit and manage your documents with simple online tools. 100% client-side privacy — your files never leave your device. No size limits."
        keywords="free PDF editor, compress PDF, merge PDF, split PDF, PDF to Word, Word to PDF, compress DOCX, compress PPTX, JSON formatter, image compressor, online tools, pdfnest.shop"
        canonical="/"
        includeWebsite={true}
      />
      
      {/* ─── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <section className="pt-8 pb-4 text-center max-w-5xl mx-auto space-y-8">
        
        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>100% Client-Side Privacy • Zero File Uploads</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
          Everything You Need to <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-primary/90 to-blue-400 bg-clip-text text-transparent">
            Work With PDFs
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Merge, compress, convert, edit and manage your documents with simple online tools.
          Private, fast, and completely free — no accounts or file limits required.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/all-tools/"
            className="px-8 py-4 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center gap-2 group hover:-translate-y-0.5"
          >
            <span>Explore All 16 Tools</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/compress-pdf/"
            className="px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-base transition-all hover:-translate-y-0.5"
          >
            Compress PDF
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Server Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Handles 300MB+ Decks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Watermarks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No Registration</span>
          </div>
        </div>

        {/* Interactive Feature Visual Preview */}
        <div className="pt-8">
          <div className="p-4 sm:p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <Link 
                to="/merge-pdf/"
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-400/40 hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-400/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Merge className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-sm">Merge PDF</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Combine multiple files</div>
              </Link>

              <Link 
                to="/compress-pdf/"
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-400/40 hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileDown className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-sm">Compress PDF</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Shrink size up to 80%</div>
              </Link>

              <Link 
                to="/pdf-to-word/"
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-400/40 hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-sm">PDF to Word</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Keep text & formatting</div>
              </Link>

              <Link 
                to="/compress-pptx/"
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-400/40 hover:bg-white/[0.05] transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-400/10 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Presentation className="w-4 h-4" />
                </div>
                <div className="font-bold text-white text-sm">Compress PPTX</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Over 300MB supported</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. POPULAR PDF TOOLS ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Fast Quick-Access</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Popular Tools</h2>
          </div>
          <Link 
            to="/all-tools/" 
            className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularTools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full font-medium">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono text-[11px] bg-white/[0.03] px-2 py-0.5 rounded">
                    Max: {tool.maxSize}
                  </span>
                  <span className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 3. BROWSE TOOLS BY CATEGORY WITH LIVE SEARCH ─────────────────── */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-muted-foreground">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Complete Suite</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Browse Tools by Category</h2>
          <p className="text-sm text-muted-foreground">
            Find the exact utility you need for documents, slides, images, and code.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search all 16 tools (e.g. Word, PPTX, JPG, Compress)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-primary/50 text-white placeholder:text-muted-foreground text-sm outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start md:justify-center scrollbar-none">
          {TOOL_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 font-semibold'
                  : 'bg-white/[0.02] text-muted-foreground hover:bg-white/[0.06] hover:text-white border border-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-white group-hover:text-primary transition-colors text-base">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="text-[11px] text-white/70">
                    {tool.supportedFormats?.slice(0, 2).join(', ')}
                  </span>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Use Tool <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── 4. WHY CHOOSE PDFNEST? ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Built Different</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Why Choose PdfNest?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most online PDF websites upload your files to remote servers. We built PdfNest so your private data never leaves your device.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All PDF manipulations, text parsing, and compression happen inside your web browser. No cloud uploads, no server storage, zero data leakage.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No File Size Limits (300MB+)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tired of 25MB limits on other sites? Because operations run locally, you can compress heavy 100MB, 200MB, or 300MB+ decks without server caps.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Lightning Fast Hardware</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No waiting in remote conversion queues or waiting for uploads. WebAssembly and Web Workers harness your device hardware for instant results.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Free Forever</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Zero watermarks, zero email walls, and zero monthly subscriptions. Unlimited access to clean, professional document tools anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. HOW PDFNEST WORKS (3 SIMPLE STEPS) ─────────────────────────── */}
      <section className="max-w-5xl mx-auto p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">How PdfNest Works</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Three simple steps to process your documents securely in seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="space-y-4 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto md:mx-0">
              1
            </div>
            <h3 className="text-base font-bold text-white">Select or Drop Your File</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Choose your PDF, Word document, PowerPoint presentation, or image directly from your computer or phone.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto md:mx-0">
              2
            </div>
            <h3 className="text-base font-bold text-white">Instant In-Browser Processing</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your browser memory executes the conversion or compression locally. No network waiting and zero data sent to external servers.
            </p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center mx-auto md:mx-0">
              3
            </div>
            <h3 className="text-base font-bold text-white">Download Clean Result</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Save your newly compressed, merged, or converted document with original formatting preserved and zero watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. LATEST HELPFUL ARTICLES ───────────────────────────────────── */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Guides & Tutorials</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Latest Helpful Articles</h2>
          </div>
          <Link 
            to="/blog/" 
            className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestArticles.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}/`}
              className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span className="text-primary font-semibold">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {post.metaDescription}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-primary font-semibold">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 7. FAQ SECTION ────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Everything you need to know about our browser-based tools and privacy architecture.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-white text-base hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. BOTTOM CTA BANNER ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto p-8 sm:p-12 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/[0.08] via-transparent to-blue-500/[0.08] text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to Work Faster and Keep Your Documents Private?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          No sign-ups, no software installs, and zero files sent to remote servers. Choose a tool and start immediately.
        </p>
        <div>
          <Link
            to="/all-tools/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/25"
          >
            <span>Browse All 16 Tools Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
