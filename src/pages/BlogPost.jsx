import { useParams, Navigate, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO, { buildBlogPostSchema, buildFAQSchema, buildBreadcrumbSchema } from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import FAQSection from '../components/FAQSection';
import blogPosts from '../data/blogPosts';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title }
  ];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.metaDescription,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="space-y-0">
      <SEO
        title={post.title}
        description={post.metaDescription}
        canonical={`/blog/${post.slug}`}
        keywords={post.keywords}
        ogType="article"
        schemas={[
          buildBlogPostSchema({
            title: post.title,
            description: post.metaDescription,
            slug: post.slug,
            datePublished: post.publishDate,
          }),
          ...(post.faqs ? [buildFAQSchema(post.faqs)] : []),
          buildBreadcrumbSchema(breadcrumbs),
        ]}
      />

      <article className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Breadcrumb items={breadcrumbs} />
        
        <header className="mb-12 text-center border-b border-white/5 pb-12">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm font-medium text-muted-foreground">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight text-white">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {post.metaDescription}
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          {post.sections.map((section, index) => (
            <section key={index} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 tracking-tight">
                {section.heading}
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-4">
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-6 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-2" {...props} />,
                    li: ({node, ...props}) => <li className="pl-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-8 border border-white/10 rounded-xl">
                        <table className="w-full text-sm text-left" {...props} />
                      </div>
                    ),
                    th: ({node, ...props}) => <th className="px-4 py-3 bg-white/5 text-white font-semibold border-b border-white/10" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-3 border-b border-white/5" {...props} />,
                  }}
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            </section>
          ))}
        </div>

        {post.faqs && post.faqs.length > 0 && (
          <div className="mt-16 border-t border-white/5 pt-12">
            <FAQSection faqs={post.faqs} title="Frequently Asked Questions" />
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground mr-2" />
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-xs text-muted-foreground border border-white/5">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" /> Share Article
            </button>
          </div>
        </footer>
        
        <div className="mt-16 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
