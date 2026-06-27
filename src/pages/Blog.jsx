import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import SEO, { buildBreadcrumbSchema } from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import blogPosts from '../data/blogPosts';

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Blog' }
];

export default function Blog() {
  return (
    <div className="space-y-0">
      <SEO
        title="PdfNest Blog — PDF Tips, Guides & Tutorials"
        description="Read the latest tips, guides, and tutorials on how to manage, convert, merge, and compress PDF files effectively."
        canonical="/blog"
        keywords="pdf blog, pdf tips, pdf guides, pdf tutorials, how to pdf, pdfnest blog"
        schemas={[
          buildBreadcrumbSchema(breadcrumbs)
        ]}
      />

      <section className="px-4 py-12 md:py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider uppercase mb-4">
              <BookOpen className="w-3 h-3" />
              <span>PdfNest Blog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Tips, Guides & Tutorials
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about working with PDFs, document management, and online tools.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map(post => (
              <Link 
                key={post.slug} 
                to={`/blog/${post.slug}`}
                className="group flex flex-col h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4 text-xs font-medium text-muted-foreground">
                    <span className="px-2 py-1 bg-white/10 rounded-md text-white">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                    {post.metaDescription}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {post.tags.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
