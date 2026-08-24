import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Menu, X, Sun, Moon, ChevronDown, 
  FileText, FileJson, Image as ImageIcon, Calculator, Code, Merge, Scissors, FileDown, Zap, FileImage
} from 'lucide-react';
import { ALL_TOOLS } from './RelatedTools';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
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
    setIsOpen(false);
    setIsToolsOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Click outside listener for tools dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsOpen(false);
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

  const pdfTools = ALL_TOOLS.filter(t => t.category === 'PDF Tools');
  const devTools = ALL_TOOLS.filter(t => t.category !== 'PDF Tools');

  const handleSelectTool = (path) => {
    setIsSearchOpen(false);
    setIsToolsOpen(false);
    setIsOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 glass backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden group-hover:rotate-6 transition-transform border border-white/15 shadow-md">
                <img src="/image.png?v=2" alt="PdfNest Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                PdfNest
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/' ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Home
              </Link>
              
              {/* Desktop Mega Tools Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  onMouseEnter={() => setIsToolsOpen(true)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 ${
                    isToolsOpen || location.pathname.includes('/pdf') || location.pathname.includes('/compress') || location.pathname.includes('/json') || location.pathname.includes('/cgpa') || location.pathname.includes('/code') || location.pathname.includes('/image')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <span>Tools</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isToolsOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                {/* Dropdown Panel */}
                {isToolsOpen && (
                  <div 
                    onMouseLeave={() => setIsToolsOpen(false)}
                    className="absolute top-full left-0 mt-3 w-[620px] rounded-2xl bg-[#131427] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.95)] p-5 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]"
                  >
                    {/* PDF Tools Column */}
                    <div>
                      <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">PDF & Document Tools</span>
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">{pdfTools.length} tools</span>
                      </div>
                      <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
                        {pdfTools.map((tool) => {
                          const Icon = tool.icon;
                          const isActive = location.pathname === tool.path || location.pathname === tool.path.replace(/\/$/, '');
                          return (
                            <Link
                              key={tool.id}
                              to={tool.path}
                              onClick={() => setIsToolsOpen(false)}
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
                    </div>

                    {/* Developer & Utility Tools Column */}
                    <div>
                      <div className="flex items-center justify-between mb-3 px-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Developer & Utility Tools</span>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">{devTools.length} tools</span>
                      </div>
                      <div className="space-y-1">
                        {devTools.map((tool) => {
                          const Icon = tool.icon;
                          const isActive = location.pathname === tool.path || location.pathname === tool.path.replace(/\/$/, '');
                          return (
                            <Link
                              key={tool.id}
                              to={tool.path}
                              onClick={() => setIsToolsOpen(false)}
                              className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                                isActive 
                                  ? 'bg-purple-500/20 text-white font-medium border border-purple-500/30' 
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
                    </div>
                  </div>
                )}
              </div>

              <Link 
                to="/blog/" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname.startsWith('/blog') ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                Blog & Guides
              </Link>
            </div>
          </div>

          {/* Right Action Controls: Search, Theme Toggle, Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-all text-xs"
              title="Search tools (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/10 text-muted-foreground">
                Ctrl K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden fixed inset-x-0 top-[61px] bottom-0 z-[100] bg-[#131427] border-t border-white/10 flex flex-col overflow-y-auto animate-in slide-in-from-top duration-200">
            <div className="p-4 space-y-4 flex-1">
              
              {/* Quick Navigation */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    location.pathname === '/' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-white hover:bg-white/5'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/blog/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    location.pathname.startsWith('/blog') ? 'bg-primary/20 text-primary border border-primary/30' : 'text-white hover:bg-white/5'
                  }`}
                >
                  Blog & Guides
                </Link>
              </div>

              {/* Tools Accordion */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary"
                >
                  <span>All Tools ({ALL_TOOLS.length})</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMobileToolsOpen && (
                  <div className="mt-2 space-y-1">
                    {ALL_TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = location.pathname === tool.path || location.pathname === tool.path.replace(/\/$/, '');
                      return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                            isActive ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Extra Mobile Links */}
              <div className="border-t border-white/10 pt-4 space-y-1">
                <Link
                  to="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-white"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-white"
                >
                  Contact Us
                </Link>
              </div>

            </div>
          </div>
        )}
      </nav>

      {/* Global Interactive Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          
          {/* Backdrop */}
          <div 
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Dialog Container */}
          <div className="relative w-full max-w-xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            
            {/* Input Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/5">
              <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (e.g., Merge PDF, JSON Formatter, Word to PDF)..."
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

            {/* Results List */}
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
                  No tools found matching "<span className="text-white font-medium">{searchQuery}</span>"
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-2.5 border-t border-white/10 bg-white/5 text-xs text-muted-foreground flex justify-between items-center">
              <span>{filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'} available</span>
              <span>Press <kbd className="bg-white/10 px-1 rounded text-[10px]">ESC</kbd> to close</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
