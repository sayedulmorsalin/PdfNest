import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'PDF Editor', path: '/pdf-editor/' },
    { name: 'Merge PDF', path: '/merge-pdf/' },
    { name: 'Compress PDF', path: '/compress-pdf/' },
    { name: 'Split PDF', path: '/split-pdf/' },
    { name: 'Compress DOCX', path: '/compress-docx/' },
    { name: 'Compress PPTX', path: '/compress-pptx/' },
  ];

  const dropdownLinks = [
    { name: 'JSON Formatter', path: '/json-formatter/' },
    { name: 'Image Compressor', path: '/image-compressor/' },
    { name: 'CGPA Calculator', path: '/cgpa-calculator/' },
    { name: 'Code Formatter', path: '/code-formatter/' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 glass px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden group-hover:rotate-12 transition-transform border border-white/10">
              <img src="/image.png?v=2" alt="PdfNest Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              PdfNest
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
            
            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                Tools
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-xl glass border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                <div className="p-2 flex flex-col">
                  {links.filter(l => l.path !== '/').map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link to="/blog" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith('/blog') ? 'text-primary' : 'text-muted-foreground'}`}>Blog</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden md:flex p-2 rounded-full hover:bg-white/5 transition-colors">
            <Sun className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="md:hidden flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-b border-white/5 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium ${
                  location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
