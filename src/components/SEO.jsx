import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://pdfnest.shop';
const SITE_NAME = 'PdfNest';
const DEFAULT_IMAGE = `${SITE_URL}/image.png?v=2`;
const DEFAULT_DESCRIPTION = 'PdfNest: Free online tools including PDF editor, PDF to Word converter, JSON formatter, image compressor, and code formatter. Fast, secure, and privacy-focused.';
const DEFAULT_KEYWORDS = 'PDF editor, PDF to Word, convert PDF, merge PDF, split PDF, compress PDF, JSON formatter, image compressor, code formatter, free online tools, pdfnest.shop';

// Organization schema — used sitewide
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SITE_NAME,
  "url": SITE_URL,
  "logo": DEFAULT_IMAGE,
  "description": "Free online tools for PDF editing, conversion, JSON formatting, and image compression.",
  "sameAs": [
    "https://github.com/sayedulmorsalin"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "sayadulmorsalin123@gmail.com",
    "contactType": "customer support"
  }
};

// WebSite schema — used on homepage
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_URL,
  "description": DEFAULT_DESCRIPTION,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

/**
 * Generate SoftwareApplication schema for tool pages
 */
export function buildSoftwareAppSchema({ name, description, category = 'UtilityApplication', features = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "operatingSystem": "Web",
    "applicationCategory": category,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": features
  };
}

/**
 * Generate FAQPage schema from array of {q, a} objects
 */
export function buildFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
}

/**
 * Generate BreadcrumbList schema from array of {name, url} objects
 */
export function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.url}`
    }))
  };
}

/**
 * Generate BlogPosting schema
 */
export function buildBlogPostSchema({ title, description, slug, datePublished, dateModified, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": `${SITE_URL}/blog/${slug}`,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "image": image || DEFAULT_IMAGE,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": DEFAULT_IMAGE
      }
    }
  };
}

/**
 * Enhanced SEO Component
 * 
 * @param {string} title - Page title
 * @param {string} description - Meta description
 * @param {string} canonical - Canonical path (e.g., "/merge-pdf")
 * @param {string} keywords - Meta keywords
 * @param {Array} schemas - Array of JSON-LD schema objects
 * @param {string} ogImage - Open Graph image URL
 * @param {string} ogType - Open Graph type (default: "website")
 * @param {boolean} includeOrganization - Include Organization schema
 * @param {boolean} includeWebsite - Include WebSite schema (homepage only)
 */
export default function SEO({ 
  title, 
  description, 
  canonical, 
  keywords,
  schemas = [],
  ogImage,
  ogType = 'website',
  includeOrganization = true,
  includeWebsite = false,
}) {
  const siteTitle = 'PdfNest — All-in-One Free Online Tools';
  const fullTitle = title ? `${title} | PdfNest` : siteTitle;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaKeywords = keywords || DEFAULT_KEYWORDS;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const image = ogImage || DEFAULT_IMAGE;

  // Build all schemas
  const allSchemas = [...schemas];
  if (includeOrganization) allSchemas.push(organizationSchema);
  if (includeWebsite) allSchemas.push(websiteSchema);

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="author" content="PdfNest" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) — one script per schema */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
