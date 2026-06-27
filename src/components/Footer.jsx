import { ExternalLink, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_TOOLS } from './RelatedTools';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-background/50 pt-16 pb-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 group-hover:rotate-12 transition-transform">
              <img src="/image.png?v=2" alt="PdfNest Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight">PdfNest</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Beautiful, fast, and free tools for students and developers. 
            All tools run locally in your browser to ensure maximum privacy.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Top Tools</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {ALL_TOOLS.slice(0, 5).map(tool => (
              <li key={tool.id}><Link to={tool.path} className="hover:text-primary transition-colors">{tool.name}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Resources</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link to="/blog" className="hover:text-primary transition-colors text-primary font-medium">Blog & Guides</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-6 text-white">Connect</h4>
          <div className="flex gap-4">
            <a 
              href="https://sayedulmarsalin.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              title="Portfolio"
            >
              <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="https://github.com/sayedulmorsalin" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href="mailto:sayadulmorsalin123@gmail.com" 
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
              title="Email"
            >
              <Mail className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
