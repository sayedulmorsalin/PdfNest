import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  FileJson, 
  Image as ImageIcon, 
  Calculator, 
  Search,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const TOOLS = [
  {
    id: 'pdf-editor',
    name: 'PDF Editor',
    description: 'Convert PDFs to Word/PPTX, merge, split, and compress PDF files securely.',
    icon: <FileText className="w-6 h-6" />,
    path: '/pdf-editor',
    category: 'PDF Tools',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10'
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Beautifully format and minify your JSON data with syntax highlighting.',
    icon: <FileJson className="w-6 h-6" />,
    path: '/json-formatter',
    category: 'Developer Tools',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Reduce image file size with client-side compression. Privacy first.',
    icon: <ImageIcon className="w-6 h-6" />,
    path: '/image-compressor',
    category: 'Image Tools',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10'
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    description: 'Calculate your CGPA based on the Bangladesh (BD) grading system.',
    icon: <Calculator className="w-6 h-6" />,
    path: '/cgpa-calculator',
    category: 'Student Tools',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10'
  },
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    description: 'Format JavaScript, HTML, CSS, and JSON using Prettier standards.',
    icon: <Code className="w-6 h-6" />,
    path: '/code-formatter',
    category: 'Developer Tools',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10'
  }
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(TOOLS.map(t => t.category))];

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                         tool.description.toLowerCase().includes(search.toLowerCase());
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
                {tool.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-grow">{tool.description}</p>
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

      {/* Ad Placeholder Bottom */}
      <div className="w-full h-32 glass rounded-2xl flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest border-dashed border-white/10 mt-12">
        Advertisement
      </div>
    </div>
  );
}
