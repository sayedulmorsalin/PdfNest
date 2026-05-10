import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical, keywords, schema }) {
  const siteTitle = 'PdfNest — All-in-One Free Online Tools';
  const fullTitle = title ? `${title} | PdfNest` : siteTitle;
  const defaultDescription = 'Free online tools including PDF editor (convert, merge, split PDFs), JSON formatter, image compressor, CGPA calculator, and code formatter. Fast, secure, and privacy-focused for students and developers.';
  const defaultKeywords = 'PDF editor, PDF converter, JSON formatter, image compressor, CGPA calculator, code formatter, developer tools, student tools, free online tools';

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonical ? `https://pdfnest.com${canonical}` : 'https://pdfnest.com'} />
      <meta name="author" content="PdfNest" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical ? `https://pdfnest.com${canonical}` : 'https://pdfnest.com'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content="https://pdfnest.com/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical ? `https://pdfnest.com${canonical}` : 'https://pdfnest.com'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content="https://pdfnest.com/og-image.png" />

      {/* Structured Data (JSON-LD) */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {!schema && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PdfNest",
            "url": "https://pdfnest.com",
            "description": defaultDescription,
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pdfnest.com/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
    </Helmet>
  );
}
