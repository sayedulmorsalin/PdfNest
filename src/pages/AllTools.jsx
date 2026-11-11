import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Sparkles, ArrowRight, ShieldCheck, Zap, 
  Filter, Layers, FileCheck, CheckCircle2 
} from 'lucide-react';
import SEO, { buildBreadcrumbSchema } from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../components/RelatedTools';

export default function AllTools() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const popularTools = useMemo(() => ALL_TOOLS.filter(t => t.popular), []);

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const query = search.toLowerCase().trim();
      const matchesSearch = 
        !query || 
        tool.name.toLowerCase().includes(query) || 
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'All Tools', path: '/all-tools/' }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      <SEO
        title="All Online PDF, Office & Image Tools (100% Free) | PdfNest"
        description="Browse all 16 free online tools from PdfNest: Merge PDF, Compress PDF, Convert PDF to Word, Compress PPTX, Compress DOCX, Image Compressor & more. 100% client-side privacy."
        canonical="/all-tools/"
        keywords="all pdf tools, free online tools, merge pdf, compress pdf, pdf to word, compress pptx, compress docx, image compressor, json formatter, pdfnest tools"
        schemas={[
          buildBreadcrumbSchema(breadcrumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'PdfNest All Online Tools Directory',
            description: 'Comprehensive directory of free browser-based PDF, Office, image and developer utilities.',
            url: 'https://pdfnest.shop/all-tools/',
          }
        ]}
      />

      {/* Hero Header */}
      <section className="text-center pt-8 pb-4 max-w-4xl mx-auto space-y-6">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Tools Directory</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          All Your Tools in <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">One Place</span>
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Access our complete collection of fast, free, and privacy-focused document tools. 
          Everything runs 100% locally inside your web browser — your confidential files never leave your device.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by tool name, format, or category (e.g. PPTX, Word, Merge)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-primary/60 focus:bg-white/[0.07] outline-none transition-all text-white placeholder:text-muted-foreground text-sm shadow-inner"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-white bg-white/10 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none justify-start md:justify-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {TOOL_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold'
                  : 'bg-white/[0.03] text-muted-foreground hover:bg-white/[0.08] hover:text-white border border-white/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Popular Tools Section (shown when no search query and category is 'All') */}
      {!search && selectedCategory === 'All' && (
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Most Popular Tools</h2>
            </div>
            <span className="text-xs text-muted-foreground">High daily demand</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularTools.map(tool => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-transparent hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                      Popular
                    </span>
                  </div>

                  <div>
                    <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="bg-white/5 px-2.5 py-1 rounded-md text-[11px] font-medium text-white/80">
                      Max: {tool.maxSize}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      Open Tool <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* All Filtered Tools Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-white">
              {selectedCategory === 'All' ? 'All Document & Utility Tools' : selectedCategory}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <p className="text-lg font-semibold text-white mb-2">No matching tools found</p>
            <p className="text-sm text-muted-foreground mb-6">
              Try searching for &quot;PDF&quot;, &quot;Word&quot;, &quot;PPTX&quot;, &quot;Compress&quot;, or clear your filters.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-muted-foreground bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full font-medium">
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
                    <div className="flex gap-1.5 flex-wrap">
                      {tool.supportedFormats?.slice(0, 2).map((fmt, i) => (
                        <span key={i} className="text-[10px] bg-white/[0.04] text-white/70 px-2 py-0.5 rounded font-mono">
                          {fmt}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:translate-x-1 transition-transform">
                      Use Tool <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Trust & Architecture Banner */}
      <section className="max-w-6xl mx-auto p-8 rounded-3xl border border-white/10 bg-gradient-to-r from-primary/[0.08] via-transparent to-blue-500/[0.08]">
        <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">100% Client-Side Privacy</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Files are processed locally in your browser memory. We never store or upload documents.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Zero Server Queues</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Instant execution with WebAssembly and Web Workers. No waiting in cloud conversion queues.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Always Free & No Limits</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                No subscription, no watermarks, and no sign-up forms required. Free forever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

