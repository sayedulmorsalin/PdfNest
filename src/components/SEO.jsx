import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, canonical }) {
  const siteTitle = 'UltraTools — All-in-One Free Online Tools';
  const fullTitle = title ? `${title} | UltraTools` : siteTitle;
  const defaultDescription = 'Free online tools including PDF editor (convert, merge, split PDFs), JSON formatter, image compressor, GPA calculator, and code formatter. Fast, secure, and privacy-focused for students and developers.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {canonical && <link rel="canonical" href={`https://ultratools.com${canonical}`} />}
    </Helmet>
  );
}
