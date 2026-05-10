import { Hammer, ExternalLink, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background/50 pt-16 pb-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Hammer className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">PdfNest</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Beautiful, fast, and free tools for students and developers. 
            All tools run locally in your browser to ensure maximum privacy.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Tools</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link to="/json-formatter" className="hover:text-primary transition-colors">JSON Formatter</Link></li>
            <li><Link to="/image-compressor" className="hover:text-primary transition-colors">Image Compressor</Link></li>
            <li><Link to="/cgpa-calculator" className="hover:text-primary transition-colors">CGPA Calculator</Link></li>
            <li><Link to="/code-formatter" className="hover:text-primary transition-colors">Code Formatter</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Resources</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5 text-muted-foreground" />
            </a>
            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} PdfNest. All rights reserved.</p>
        <p>Built with ❤️ for the community.</p>
      </div>
    </footer>
  );
}
