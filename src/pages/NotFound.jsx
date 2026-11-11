import { Link } from 'react-router-dom';
import { FileQuestion, ArrowRight, Home, Search, Layers } from 'lucide-react';
import SEO from '../components/SEO';
import { ALL_TOOLS } from '../components/RelatedTools';

export default function NotFound() {
  const popularTools = ALL_TOOLS.filter(t => t.popular).slice(0, 4);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 animate-in fade-in duration-500">
      <SEO
        title="404 — Page Not Found | PdfNest"
        description="The page or tool you are looking for does not exist or has been moved."
        canonical="/404"
      />

      <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-6">
        <FileQuestion className="w-10 h-10" />
      </div>

      <span className="text-xs uppercase font-bold tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10 mb-4">
        Error 404
      </span>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
        Page Not Found
      </h1>

      <p className="text-muted-foreground text-base max-w-md mx-auto mb-8 leading-relaxed">
        The tool or page you requested could not be located. It may have been moved, renamed, or never existed.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/25"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/all-tools/"
          className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Browse All Tools</span>
        </Link>
      </div>

      {/* Suggested Popular Tools */}
      <div className="w-full max-w-2xl text-left border-t border-white/10 pt-8">
        <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-center">
          Looking for one of our top tools?
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {popularTools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

