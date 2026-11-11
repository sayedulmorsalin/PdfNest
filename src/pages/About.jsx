import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Cpu, Sparkles, Heart, Lock, Zap, 
  ExternalLink, Mail, ArrowRight, CheckCircle2, Globe 
} from 'lucide-react';
import SEO, { buildBreadcrumbSchema } from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';

export default function About() {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about/' }
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <SEO
        title="About PdfNest — Free, Privacy-First Browser Document Tools"
        description="Learn about PdfNest: our mission to provide fast, privacy-focused online tools for PDFs, PowerPoint, Word, and images. All processing is 100% browser-based."
        canonical="/about/"
        keywords="about pdfnest, pdfnest mission, private pdf tools, browser based pdf editor, client side document compression"
        schemas={[
          buildBreadcrumbSchema(breadcrumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About PdfNest',
            description: 'PdfNest is a privacy-first web platform offering free online document, PDF, and image utilities.',
            url: 'https://pdfnest.shop/about/',
          }
        ]}
      />

      {/* Hero Header */}
      <section className="text-center pt-8 pb-4 space-y-6">
        <Breadcrumb items={breadcrumbs} />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase">
          <Heart className="w-3.5 h-3.5" />
          <span>Our Mission & Architecture</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Document Utility Built on <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">Total Privacy</span>
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          PdfNest was created to solve a widespread problem: most online document utilities force users 
          to upload sensitive contracts, legal documents, and personal resumes to unknown third-party cloud servers.
        </p>
      </section>

      {/* Story & Philosophy */}
      <section className="p-8 md:p-10 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6 leading-relaxed">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Why We Built PdfNest</h2>
        
        <p className="text-muted-foreground leading-relaxed">
          Whether you are a student submitting a term paper, an engineer formatting code, or a business professional 
          compressing a financial pitch deck, you shouldn&apos;t have to compromise your confidentiality or pay 
          expensive monthly subscriptions just to merge two PDFs or shrink a 100MB presentation.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          At PdfNest, we engineered our tools to run <strong className="text-white">directly inside your web browser</strong>. 
          By leveraging modern browser standards—such as WebAssembly, JavaScript Canvas APIs, and client-side memory workers—we 
          process files right on your device.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Traditional Cloud Tools
            </div>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>• Upload your confidential files to remote servers</li>
              <li>• Enforce 25MB–50MB artificial file caps</li>
              <li>• Demand email registration or paid subscriptions</li>
              <li>• Slow queue wait times on free tiers</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-primary/30 bg-primary/[0.04]">
            <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              PdfNest Architecture
            </div>
            <ul className="text-xs text-white/90 space-y-2">
              <li>• 100% client-side: Files never leave your computer</li>
              <li>• Handle large files (300MB+) without server timeouts</li>
              <li>• No sign-up, accounts, or watermarks</li>
              <li>• Instant execution powered by your device hardware</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Our Core Commitments</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Uncompromising Privacy</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never collect, store, inspect, or sell your documents. Because processing runs in your browser memory, 
              we literally cannot see what you convert or compress.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Pure Utility</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No endless popups, no hidden paywalls, and no bait-and-switch downloads. When you need a task done, 
              it should take three seconds, not ten minutes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Modern Engineering</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built on React 19, Tailwind CSS v4, and open-source engines like PDF.js, PDF-lib, and Prettier to 
              ensure fast performance on desktop and mobile.
            </p>
          </div>
        </div>
      </section>

      {/* Developer & Contact */}
      <section className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Have Feedback or Feature Requests?</h2>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            PdfNest is actively developed and maintained. If you encounter a formatting issue or have suggestions 
            for new document tools, we would love to hear from you.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            to="/contact/"
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>
          <Link
            to="/all-tools/"
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            <span>Explore Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

