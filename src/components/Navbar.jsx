import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Menu, X, Sun, Moon, ChevronDown, 
  FileText, FileJson, Image as ImageIcon, Calculator, Code, Merge, 
  Scissors, FileDown, Zap, FileImage, Presentation, ShieldCheck, ArrowRight,
  Layers, Info, Mail
} from 'lucide-react';
import BrandLogo from './icons/BrandLogo';
import { ALL_TOOLS } from './RelatedTools';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // null | 'pdf' | 'office'
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState('pdf');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync theme with html root element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Close dropdowns on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K for search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Filter tools by search query
  const filteredTools = searchQuery.trim() === '' 
    ? ALL_TOOLS 
    : ALL_TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const pdfTools = ALL_TOOLS.filter(t => t.category.includes('PDF'));
  const officeTools = ALL_TOOLS.filter(t => t.category === 'Office Tools');
  const imageTools = ALL_TOOLS.filter(t => t.category === 'Image Tools');
  const devTools = ALL_TOOLS.filter(t => t.category === 'Developer Utilities');

  const handleSelectTool = (path) => {
    setIsSearchOpen(false);
    setActiveDropdown(null);
    setIsOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0f111a]/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform drop-shadow-md">
                <BrandLogo className="w-9 h-9 drop-shadow-[0_2px_10px_rgba(235,61,30,0.35)]" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                PdfNest
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-5">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>

              <Link 
                to="/all-tools/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/all-tools') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                All Tools
              </Link>
              
              {/* PDF Tools Mega Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'pdf' ? null : 'pdf')}
                  onMouseEnter={() => setActiveDropdown('pdf')}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors py-2 ${
                    activeDropdown === 'pdf' || (location.pathname.includes('/pdf') && !location.pathname.includes('/compress-pptx') && !location.pathname.includes('/compress-docx'))
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <span>PDF Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'pdf' ? 'rotate-180 text-primary' : ''}`} />
                </button>

                {/* Dropdown Panel */}
                {activeDropdown === 'pdf' && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-2 w-[540px] rounded-2xl bg-[#131524] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-5 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-150 z-[100]"
                  >
                    <div className="col-span-2 pb-2 mb-1 border-b border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-wider text-primary">Popular PDF Utilities</span>
                      <span>100% Client-Side</span>
                    </div>

                    {pdfTools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = location.pathname === tool.path || location.pathname === tool.path.replace(/\/$/, '');
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => setActiveDropdown(null)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-primary/20 text-white font-medium border border-primary/30' 
                              : 'hover:bg-white/5 text-muted-foreground hover:text-white'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{tool.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{tool.shortDescription}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Office Tools Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setActiveDropdown(activeDropdown === 'office' ? null : 'office')}
                  onMouseEnter={() => setActiveDropdown('office')}
                  className={`flex items-center gap-1 text-sm font-medium transition-colors py-2 ${
                    activeDropdown === 'office' || location.pathname.includes('/compress-pptx') || location.pathname.includes('/compress-docx') || location.pathname.includes('/pptx') || location.pathname.includes('/word')
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <span>Office Tools</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'office' ? 'rotate-180 text-primary' : ''}`} />
                </button>

                {activeDropdown === 'office' && (
                  <div 
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-2 w-[400px] rounded-2xl bg-[#131524] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-4 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-[100]"
                  >
                    <div className="pb-2 mb-1 border-b border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-bold uppercase tracking-wider text-orange-400">Word & PowerPoint Optimization</span>
                      <span className="text-[10px] bg-orange-400/20 text-orange-300 px-2 py-0.5 rounded font-mono">300MB+ decks</span>
                    </div>

                    {[...officeTools, ...ALL_TOOLS.filter(t => t.id === 'word-to-pdf' || t.id === 'pptx-to-pdf')].map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all text-muted-foreground hover:text-white"
                        >
                          <div className={`w-8 h-8 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{tool.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{tool.shortDescription}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Image Tools Direct Link */}
              <Link 
                to="/image-compressor/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/image-compressor') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Image Tools
              </Link>

              {/* Blog Link */}
              <Link 
                to="/blog/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/blog') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Blog
              </Link>

              {/* About Link */}
              <Link 
                to="/about/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/about') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                About
              </Link>

              {/* Contact Link */}
              <Link 
                to="/contact/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/contact') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Right Action Controls: Search, Theme Toggle, Mobile Hamburger */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-all text-xs"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/10 text-muted-foreground">
                Ctrl K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[61px] bottom-0 z-[100] bg-[#101221] border-t border-white/10 flex flex-col overflow-y-auto animate-in slide-in-from-top duration-200">
            <div className="p-4 space-y-4 flex-1">
              
              {/* Quick Navigation Links */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    location.pathname === '/' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white'
                  }`}
                >
                  <span>Home</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>

                <Link
                  to="/all-tools/"
                  onClick={() => setIsOpen(false)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                    location.pathname.startsWith('/all-tools') ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white'
                  }`}
                >
                  <span>All Tools ({ALL_TOOLS.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              </div>

              {/* Categorized Tools Sections */}
              <div className="space-y-3 pt-2">
                {/* PDF Tools Accordion */}
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setIsMobileCategoryOpen(isMobileCategoryOpen === 'pdf' ? null : 'pdf')}
                    className="flex items-center justify-between w-full p-3.5 text-xs font-bold uppercase tracking-wider text-primary"
                  >
                    <span>PDF & Document Tools ({pdfTools.length})</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoryOpen === 'pdf' ? 'rotate-180' : ''}`} />
                  </button>

                  {isMobileCategoryOpen === 'pdf' && (
                    <div className="px-3 pb-3 space-y-1">
                      {pdfTools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = location.pathname === tool.path || location.pathname === tool.path.replace(/\/$/, '');
                        return (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                              isActive ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-md ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Office Tools Accordion */}
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setIsMobileCategoryOpen(isMobileCategoryOpen === 'office' ? null : 'office')}
                    className="flex items-center justify-between w-full p-3.5 text-xs font-bold uppercase tracking-wider text-orange-400"
                  >
                    <span>Office Tools (Word / PPTX)</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoryOpen === 'office' ? 'rotate-180' : ''}`} />
                  </button>

                  {isMobileCategoryOpen === 'office' && (
                    <div className="px-3 pb-3 space-y-1">
                      {[...officeTools, ...ALL_TOOLS.filter(t => t.id === 'word-to-pdf' || t.id === 'pptx-to-pdf')].map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <div className={`w-6 h-6 rounded-md ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Developer & Utility Tools Accordion */}
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setIsMobileCategoryOpen(isMobileCategoryOpen === 'dev' ? null : 'dev')}
                    className="flex items-center justify-between w-full p-3.5 text-xs font-bold uppercase tracking-wider text-cyan-400"
                  >
                    <span>Image & Developer Utilities</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isMobileCategoryOpen === 'dev' ? 'rotate-180' : ''}`} />
                  </button>

                  {isMobileCategoryOpen === 'dev' && (
                    <div className="px-3 pb-3 space-y-1">
                      {[...imageTools, ...devTools].map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <div className={`w-6 h-6 rounded-md ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate">{tool.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Informational & Legal Links */}
              <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/blog/"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-white bg-white/[0.02]"
                >
                  Blog & Guides
                </Link>
                <Link
                  to="/about/"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-white bg-white/[0.02]"
                >
                  About Us
                </Link>
                <Link
                  to="/contact/"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-white bg-white/[0.02]"
                >
                  Contact
                </Link>
                <Link
                  to="/privacy/"
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-lg text-muted-foreground hover:text-white bg-white/[0.02]"
                >
                  Privacy Policy
                </Link>
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* Global Interactive Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <div 
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
          />

          <div className="relative w-full max-w-xl bg-[#141628] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g. Merge PDF, Compress PPTX, Word to PDF)..."
                className="w-full bg-transparent text-white placeholder-muted-foreground text-sm outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-2 py-1 text-xs rounded bg-white/10 text-muted-foreground hover:text-white transition-colors shrink-0"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.path)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left transition-colors group"
                    >
                      <div className={`w-9 h-9 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                            {tool.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium bg-white/5 px-2 py-0.5 rounded">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No tools found matching &quot;<span className="text-white font-medium">{searchQuery}</span>&quot;
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] text-xs text-muted-foreground flex justify-between items-center">
              <span>{filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'} available</span>
              <span>Press <kbd className="bg-white/10 px-1 rounded text-[10px]">ESC</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
