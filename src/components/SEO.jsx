import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical, keywords, schema }) {
  const siteTitle = 'PdfNest — All-in-One Free Online Tools';
  const fullTitle = title ? `${title} | PdfNest` : siteTitle;
  const defaultDescription = 'PdfNest: Free online tools including PDF editor, PDF to Word converter, JSON formatter, image compressor, and code formatter. Fast, secure, and privacy-focused.';
  const defaultKeywords = 'PDF editor, PDF to Word, convert PDF, merge PDF, split PDF, compress PDF, JSON formatter, image compressor, code formatter, free online tools, pdfnest.shop';

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonical ? `https://pdfnest.shop${canonical}` : 'https://pdfnest.shop'} />
      <meta name="author" content="PdfNest" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical ? `https://pdfnest.shop${canonical}` : 'https://pdfnest.shop'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content="https://pdfnest.shop/image.png?v=2" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical ? `https://pdfnest.shop${canonical}` : 'https://pdfnest.shop'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content="https://pdfnest.shop/image.png?v=2" />

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
            "url": "https://pdfnest.shop",
            "description": defaultDescription,
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pdfnest.shop/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
    </Helmet>
  );
}
