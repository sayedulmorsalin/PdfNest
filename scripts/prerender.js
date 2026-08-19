/**
 * prerender.js — Lightweight Static HTML Injector
 *
 * Replaces the Puppeteer-based approach with a zero-dependency Node.js solution.
 * Works on Netlify (no Chrome/Puppeteer needed). Runs in ~1-2 seconds.
 *
 * For each route:
 *  1. Reads dist/index.html (the Vite build output)
 *  2. Injects page-specific title, meta tags, JSON-LD schemas
 *  3. Adds static body content so crawlers see real HTML without running JS
 *  4. Writes dist/{route}/index.html
 *
 * React still hydrates client-side — tool functionality is unchanged.
 * Crawlers (Googlebot, Bingbot) get real content immediately.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://pdfnest.shop';
const DEFAULT_IMAGE = `${SITE_URL}/image.png?v=2`;

// ─── Schema Helpers ───────────────────────────────────────────────────────────

function softwareApp(name, description, features = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    operatingSystem: 'Web',
    applicationCategory: 'UtilityApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: features,
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      ...(url ? { item: `${SITE_URL}${url}` } : {}),
    })),
  };
}

function blogPosting(headline, description, slug, datePublished) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished,
    dateModified: '2026-08-10',
    image: DEFAULT_IMAGE,
    author: { '@type': 'Organization', name: 'PdfNest', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'PdfNest',
      logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
    },
  };
}

// ─── Route Definitions ────────────────────────────────────────────────────────
// Each route defines: path, title, description, keywords, heading, content, breadcrumbs?, schemas?, ogType?

const ROUTES = [
  {
    path: '/',
    title: 'PdfNest | Free Online PDF Editor, Compress, Convert & Merge PDFs',
    description:
      'PdfNest: Free online tools for PDF editing, conversion, and compression. Merge PDFs, convert PDF to Word, split pages, compress files, format JSON, and compress images. 100% browser-based — your files never leave your device.',
    keywords:
      'free PDF editor, compress PDF, merge PDF, split PDF, PDF to Word, Word to PDF, PDF to JPG, compress DOCX, compress PPTX, JSON formatter, image compressor, online tools, pdfnest.shop',
    heading: 'All Your Tools in One Place',
    content:
      'Fast, free, and privacy-focused online tools for developers and students. No accounts, no tracking, just pure utility. PDF editor, PDF to Word converter, PDF compressor, merge PDF, split PDF, compress DOCX, compress PPTX, JSON formatter, image compressor, code formatter, and CGPA calculator — all in one place.',
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'PdfNest',
        url: SITE_URL,
        description: 'Free online tools for PDF editing, conversion, compression, JSON formatting, and image compression.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PdfNest',
        url: SITE_URL,
        logo: DEFAULT_IMAGE,
        sameAs: ['https://github.com/sayedulmorsalin'],
      },
    ],
  },
  {
    path: '/pdf-editor',
    title: 'Professional PDF Editor — Convert PDF to Word, Merge & Split',
    description:
      'Free online PDF editor to convert PDF to Word with preserved formatting, PDF to PowerPoint, merge, split, and compress PDFs. 100% browser-based for maximum security.',
    keywords:
      'PDF to Word, free PDF editor, merge PDF, split PDF, compress PDF, PDF to PPTX, browser-based PDF editor, edit PDF online',
    heading: 'All-in-One PDF Editor',
    content:
      'Convert PDFs with preserved formatting — headings, bullets, bold text and paragraph structure are kept intact. Features: PDF to Word converter, PDF to PowerPoint, Merge PDFs, Split PDFs, Compress PDFs. 100% browser-based, no server uploads ever.',
    breadcrumbs: [['Home', '/'], ['PDF Editor']],
    schemas: [
      softwareApp('PdfNest PDF Editor', 'Free online PDF editor with conversion, merging, splitting and compression.', [
        'Convert PDF to Word (DOCX)',
        'Convert PDF to PowerPoint (PPTX)',
        'Merge PDF files',
        'Split PDF pages',
        'Compress PDF size',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Editor']]),
    ],
  },
  {
    path: '/merge-pdf',
    title: 'Merge PDF Online Free — Combine PDF Files',
    description:
      'Merge multiple PDF files into one document for free. No watermarks, no registration. Fast, secure, browser-based PDF merger.',
    keywords: 'merge pdf, merge pdf online, combine pdf, merge pdf free, combine pdf files, pdf merger online',
    heading: 'Merge PDF Online — Combine Files for Free',
    content:
      'Combine multiple PDF files into one document instantly. Upload your PDFs, arrange them in order, and merge them with a single click. 100% browser-based — your files never leave your device. No watermarks, no registration required.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Merge PDF']],
    schemas: [
      softwareApp('PdfNest PDF Merger', 'Free online tool to merge multiple PDF files into one document.', [
        'Unlimited merges', 'Drag to reorder', 'Browser-based processing', 'No watermarks', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Merge PDF']]),
    ],
  },
  {
    path: '/compress-pdf',
    title: 'Compress PDF Online Free — Reduce PDF File Size',
    description:
      'Compress PDF files online for free. Reduce PDF file size without losing quality. No watermarks, no registration. Fast, secure, browser-based PDF compressor.',
    keywords:
      'compress pdf, reduce pdf size, compress pdf online, pdf compressor, shrink pdf, compress pdf free, reduce pdf file size',
    heading: 'Compress PDF Online — Reduce File Size for Free',
    content:
      'Shrink your PDF files by up to 80% without visible quality loss. Choose Low, Recommended, or High compression. Perfect for email attachments, uploads, and storage. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Compress PDF']],
    schemas: [
      softwareApp('PdfNest PDF Compressor', 'Free online tool to compress and reduce PDF file size without quality loss.', [
        'Smart compression', 'No quality loss', 'Browser-based processing', 'No watermarks', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Compress PDF']]),
    ],
  },
  {
    path: '/split-pdf',
    title: 'Split PDF Online Free — Extract Pages from PDF',
    description:
      'Split PDF files and extract pages for free. Separate PDF pages, extract specific page ranges, or split into individual files. No watermarks, no registration required.',
    keywords:
      'split pdf, split pdf online, extract pages from pdf, split pdf free, separate pdf pages, pdf splitter, extract pdf pages',
    heading: 'Split PDF Online — Extract Pages for Free',
    content:
      'Separate your PDF into individual pages or extract specific page ranges. Select pages by number or range, then download as a new PDF. Fast, free, and completely private — no server uploads required.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Split PDF']],
    schemas: [
      softwareApp('PdfNest PDF Splitter', 'Free online tool to split PDF files and extract specific pages.', [
        'Extract specific pages', 'Split by page range', 'Split into individual files', 'Browser-based', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Split PDF']]),
    ],
  },
  {
    path: '/pdf-to-word',
    title: 'PDF to Word Converter Free — Convert PDF to DOCX Online',
    description:
      'Convert PDF files to editable Word documents (.docx) with preserved formatting, headings, and bullet points. 100% browser-based — your files never leave your device. No watermarks, no registration.',
    keywords:
      'pdf to word, convert pdf to word, pdf to docx, pdf to word converter, pdf to word free, edit pdf online, pdf to word without adobe, free pdf to word, convert pdf to docx online',
    heading: 'Convert PDF to Word — Free DOCX Converter',
    content:
      'Transform PDFs into fully editable Word (.docx) documents with preserved formatting, headings, and bullet points. Our smart parser detects font sizes, bold and italic text, and paragraph structure. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to Word']],
    schemas: [
      softwareApp('PdfNest PDF to Word Converter', 'Free online tool to convert PDF documents into editable Word (.docx) files.', [
        'Formatting preservation', 'Heading detection (H1, H2)', 'Bold and italic support',
        'Bullet point reconstruction', 'Browser-based', 'No watermarks', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to Word']]),
    ],
  },
  {
    path: '/word-to-pdf',
    title: 'Word to PDF Converter Free — Convert DOCX to PDF Online',
    description:
      'Convert Word documents (.docx) to PDF online for free. Preserve all formatting, fonts, and layouts. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords:
      'word to pdf, convert word to pdf, docx to pdf, word to pdf converter, word to pdf free, convert docx to pdf online',
    heading: 'Convert Word to PDF — Free Online Converter',
    content:
      'Transform Word documents (.docx) into universally readable PDF files with preserved formatting. Upload your Word file and download a perfectly formatted PDF instantly. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Word to PDF']],
    schemas: [
      softwareApp('PdfNest Word to PDF Converter', 'Free online tool to convert Word documents into PDF files.', [
        'Formatting preservation', 'Browser-based processing', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['Word to PDF']]),
    ],
  },
  {
    path: '/pdf-to-jpg',
    title: 'PDF to JPG Converter Free — Convert PDF to Images Online',
    description:
      'Convert PDF pages to JPG images for free. High-quality PDF to image conversion. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords:
      'pdf to jpg, pdf to image, convert pdf to jpg, pdf to jpeg, pdf to jpg converter, pdf to image converter, pdf to jpg free',
    heading: 'Convert PDF to JPG — Free Image Converter',
    content:
      'Transform PDF pages into high-quality JPG images instantly. Perfect for presentations, social media, and sharing. Each page becomes a separate JPG image. Download individually or all pages as a zip file. 100% browser-based — completely private.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to JPG']],
    schemas: [
      softwareApp('PdfNest PDF to JPG Converter', 'Free online tool to convert PDF pages to high-quality JPG images.', [
        'High-resolution output', 'Multi-page support', 'Batch download', 'Browser-based processing', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to JPG']]),
    ],
  },
  {
    path: '/pdf-to-png',
    title: 'PDF to PNG Converter Free — Convert PDF to PNG Images Online',
    description:
      'Convert PDF pages to lossless PNG images for free. High-quality PDF to PNG conversion. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords:
      'pdf to png, convert pdf to png, pdf to png converter, pdf to png free, pdf pages to png images',
    heading: 'Convert PDF to PNG — Free Image Converter',
    content:
      'Transform PDF pages into lossless PNG images. Perfect for documents requiring transparency or crisp text quality. Each page becomes a separate high-resolution PNG. 100% browser-based — completely private.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to PNG']],
    schemas: [
      softwareApp('PdfNest PDF to PNG Converter', 'Free online tool to convert PDF pages to lossless PNG images.', [
        'Lossless quality', 'Multi-page support', 'Batch download', 'Browser-based',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to PNG']]),
    ],
  },
  {
    path: '/pdf-to-pptx',
    title: 'PDF to PowerPoint Converter Free — Convert PDF to PPTX Online',
    description:
      'Convert PDF files to PowerPoint presentations (.pptx) for free. Smart slide layout from PDF structure. No watermarks, no registration. Browser-based converter.',
    keywords:
      'pdf to pptx, pdf to powerpoint, convert pdf to pptx, pdf to presentation, pdf to slides converter',
    heading: 'Convert PDF to PowerPoint — Free PPTX Converter',
    content:
      'Transform PDF documents into ready-to-present PowerPoint (.pptx) files. Our engine automatically paginates content and formats headers for slide titles. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to PowerPoint']],
    schemas: [
      softwareApp('PdfNest PDF to PowerPoint Converter', 'Free online tool to convert PDF documents into PowerPoint presentations.', [
        'Smart slide layout', 'Browser-based processing', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PDF to PowerPoint']]),
    ],
  },
  {
    path: '/pptx-to-pdf',
    title: 'PowerPoint to PDF Converter Free — Convert PPTX to PDF Online',
    description:
      'Convert PowerPoint presentations (.pptx, .ppt) to PDF for free. Preserve formatting, fonts, and layouts. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords:
      'powerpoint to pdf, convert pptx to pdf, pptx to pdf, pptx to pdf converter, powerpoint to pdf free',
    heading: 'Convert PowerPoint to PDF — Free Online Converter',
    content:
      'Transform PowerPoint presentations into universally readable PDF files with preserved formatting. Each slide is captured at high resolution. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PowerPoint to PDF']],
    schemas: [
      softwareApp('PdfNest PowerPoint to PDF Converter', 'Free online tool to convert PowerPoint presentations into PDF files.', [
        'Formatting preservation', 'Browser-based processing', 'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor'], ['PowerPoint to PDF']]),
    ],
  },
  {
    path: '/compress-docx',
    title: 'Compress Word Document Online Free – Reduce DOCX File Size | PdfNest',
    description:
      'Compress Word documents (.docx) online for free. Reduce DOCX file size without losing text formatting, tables, or image quality. Fast, secure, 100% browser-based.',
    keywords:
      'compress docx, reduce word document size, compress word file, docx compressor, shrink word document, compress docx online, reduce docx size, word file compressor, compress docx size, docx reducer, word document compressor, reduce file size docx, compress word file online, reduce word file size online free, compress docx file online free',
    heading: 'Compress Word Documents Online',
    content:
      'Shrink your Word documents (.docx) instantly while preserving formatting and quality. 100% free and private — your documents are never uploaded to any server. Optimize embedded images and zip archives in your browser.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress DOCX']],
    schemas: [
      softwareApp('PdfNest Word Document Compressor', 'Free online tool to compress Word documents (.docx) and reduce file size without losing formatting.', [
        'Compress Word document DOCX online', 'Reduce Word file size free', 'Preserve text formatting and tables', '100% private client-side processing', 'No watermarks or registration',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress DOCX', '/compress-docx/']]),
    ],
  },
  {
    path: '/compress-pptx',
    title: 'Compress PowerPoint Online Free – Reduce PPT & PPTX Size | PdfNest',
    description:
      'Compress PowerPoint files online for free. Reduce PPT, PPTX, and presentation file size without losing image quality or slide formatting. Fast, secure, 100% browser-based.',
    keywords:
      'compress powerpoint, ppt file compressor, compress powerpoint file, compress ppt, ppt compressor, compress ppt file, compress ppt size online, compress powerpoint online free, free ppt compressor, pptx compressor, compress powerpoint presentation, compress pptx, reduce ppt size, powerpoint file reducer, online ppt file compressor',
    heading: 'Compress PowerPoint Files Online',
    content:
      'Reduce the file size of your PowerPoint presentations (.pptx, .ppsx) quickly and easily. 100% free and private — your presentation slides never leave your device. Smart image re-encoding and XML package compression.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress PPTX']],
    schemas: [
      softwareApp('PdfNest PowerPoint Compressor', 'Free online tool to compress PowerPoint presentations (.pptx) and reduce file size without losing quality.', [
        'Compress PPT and PPTX online', 'Reduce PowerPoint size free', '100% private browser processing', 'No quality loss option', 'No watermarks or file limits',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress PPTX', '/compress-pptx/']]),
    ],
  },
  {
    path: '/json-formatter',
    title: 'JSON Formatter Online Free — Format, Validate & Minify JSON',
    description:
      'Format, validate, and minify JSON data online for free. Syntax highlighting, error detection, and pretty print. No registration required.',
    keywords:
      'json formatter, format json, json validator, json beautifier, json minifier, json pretty print, online json formatter',
    heading: 'JSON Formatter — Format, Validate & Minify JSON Online',
    content:
      'Format messy JSON data into clean, readable output with syntax highlighting. Validate JSON structure, detect errors, and minify for production. Completely free, works instantly in your browser.',
    schemas: [
      softwareApp('PdfNest JSON Formatter', 'Free online JSON formatter, validator, and minifier with syntax highlighting.', [
        'JSON formatting', 'JSON validation', 'JSON minification', 'Syntax highlighting', 'Error detection',
      ]),
    ],
  },
  {
    path: '/image-compressor',
    title: 'Image Compressor Online Free — Compress Images Without Losing Quality',
    description:
      'Compress images online for free without losing visual quality. Supports JPEG, PNG, WebP. Reduce image file size for web, email, and storage.',
    keywords:
      'image compressor, compress image online, reduce image size, image optimizer, compress jpg, compress png, image compression free',
    heading: 'Image Compressor — Reduce Image Size for Free',
    content:
      'Compress JPEG, PNG, and WebP images without visible quality loss. Perfect for optimizing images for websites, email attachments, and storage. 100% browser-based — images never leave your device.',
    schemas: [
      softwareApp('PdfNest Image Compressor', 'Free online image compression tool that reduces file size without losing quality.', [
        'JPEG compression', 'PNG compression', 'WebP support', 'Browser-based', 'Batch compression',
      ]),
    ],
  },
  {
    path: '/cgpa-calculator',
    title: 'CGPA Calculator Free — Calculate GPA with BD Grading System',
    description:
      'Calculate your CGPA online for free using the Bangladesh grading system. Add subjects, credits, and grades to instantly compute your cumulative GPA.',
    keywords:
      'cgpa calculator, gpa calculator, bd grading system, bangladesh cgpa calculator, calculate cgpa, cumulative gpa',
    heading: 'CGPA Calculator — Calculate Your GPA Instantly',
    content:
      'Calculate your Cumulative Grade Point Average (CGPA) using the Bangladesh grading system. Add subjects with credit hours and grades to get your instant GPA result. Free, accurate, and easy to use.',
    schemas: [
      softwareApp('PdfNest CGPA Calculator', 'Free CGPA calculator using the Bangladesh university grading system.', [
        'BD grading system', 'Instant calculation', 'Credit hour support', 'Free unlimited use',
      ]),
    ],
  },
  {
    path: '/code-formatter',
    title: 'Code Formatter Online Free — Format JavaScript, HTML, CSS & JSON',
    description:
      'Format and beautify JavaScript, TypeScript, HTML, CSS, and JSON code online for free using Prettier standards. Clean, consistent code formatting instantly.',
    keywords:
      'code formatter, format javascript, format html, format css, format json, prettier online, code beautifier, js formatter',
    heading: 'Code Formatter — Format JS, HTML, CSS & JSON Online',
    content:
      'Format JavaScript, TypeScript, HTML, CSS, and JSON code using Prettier standards. Get clean, consistent, readable code in seconds. Completely free, no installation required.',
    schemas: [
      softwareApp('PdfNest Code Formatter', 'Free online code formatter supporting JavaScript, HTML, CSS, and JSON.', [
        'JavaScript formatting', 'HTML formatting', 'CSS formatting', 'JSON formatting', 'Prettier standards',
      ]),
    ],
  },
  {
    path: '/blog',
    title: 'PdfNest Blog — PDF Tips, Guides & Tutorials',
    description:
      'Expert guides and tutorials on compressing, converting, merging, and managing PDF files. Learn how to use free online PDF tools effectively — no software needed.',
    keywords:
      'pdf blog, pdf tips, pdf guides, pdf tutorials, how to compress pdf, how to merge pdf, pdf converter guide, pdfnest blog, free pdf tools guide',
    heading: 'PDF Tips, Guides & Tutorials',
    content:
      'Read expert guides on how to work with PDF files, Word documents, and online tools. Topics include PDF compression, PDF to Word conversion, merging PDFs, comparing file formats, and more. All processing is free and browser-based.',
    breadcrumbs: [['Home', '/'], ['Blog']],
    schemas: [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'PdfNest Blog',
        description: 'Expert guides and tutorials on PDF tools, compression, conversion, and document management.',
        url: `${SITE_URL}/blog`,
      },
      breadcrumbSchema([['Home', '/'], ['Blog']]),
    ],
  },
  {
    path: '/blog/how-to-compress-pdf-without-losing-quality',
    title: 'How to Compress PDF Without Losing Quality in 2026',
    description:
      'Learn how to compress PDF files without losing quality. Step-by-step guide using free online tools. Reduce PDF size for email, web, and storage.',
    keywords: 'compress pdf, compress pdf without losing quality, reduce pdf size, pdf compressor, shrink pdf',
    heading: 'How to Compress PDF Without Losing Quality in 2026',
    content:
      'Large PDF files create problems everywhere. Email providers reject attachments over 25MB. Cloud storage fills up faster. Web uploads time out. Learn how to dramatically reduce PDF file size without any visible loss in quality using free browser-based tools.',
    breadcrumbs: [['Home', '/'], ['Blog', '/blog'], ['Compress PDF Guide']],
    ogType: 'article',
    schemas: [blogPosting('How to Compress PDF Without Losing Quality in 2026', 'Learn how to compress PDF files without losing quality.', 'how-to-compress-pdf-without-losing-quality', '2026-06-15')],
  },
  {
    path: '/blog/best-free-pdf-converter-2026',
    title: 'Best Free PDF Converter in 2026 — Top Tools Compared',
    description:
      'Compare the best free PDF converters in 2026. Convert PDF to Word, Excel, PowerPoint, and images without paying. Detailed comparison of features, privacy, and quality.',
    keywords: 'best free pdf converter, free pdf converter, pdf converter 2026, convert pdf free, best pdf to word converter',
    heading: 'Best Free PDF Converter in 2026 — Top Tools Compared',
    content:
      'PDFs are everywhere — contracts, reports, invoices, academic papers, government forms. A good PDF converter lets you transform PDFs into editable formats like Word, Excel, PowerPoint, or images. Compare the best free options available in 2026 based on conversion quality, privacy, speed, and ease of use.',
    breadcrumbs: [['Home', '/'], ['Blog', '/blog'], ['Best PDF Converter 2026']],
    ogType: 'article',
    schemas: [blogPosting('Best Free PDF Converter in 2026 — Top Tools Compared', 'Compare the best free PDF converters in 2026.', 'best-free-pdf-converter-2026', '2026-06-20')],
  },
  {
    path: '/blog/how-to-merge-multiple-pdfs-online',
    title: 'How to Merge Multiple PDFs Online for Free in 2026',
    description:
      'Step-by-step guide to merge multiple PDF files into one document for free. No software needed. Works on any device. Fast, secure, and easy.',
    keywords: 'merge pdf, merge pdf online, combine pdf, merge pdf free, combine pdf files, join pdf files',
    heading: 'How to Merge Multiple PDFs Online for Free in 2026',
    content:
      'Whether you are a student compiling research papers, a professional preparing a presentation package, or organizing personal documents, merging PDFs is a task you will encounter regularly. Learn the easiest free way to combine multiple PDF files into one.',
    breadcrumbs: [['Home', '/'], ['Blog', '/blog'], ['Merge PDFs Guide']],
    ogType: 'article',
    schemas: [blogPosting('How to Merge Multiple PDFs Online for Free in 2026', 'Step-by-step guide to merge multiple PDF files into one document for free.', 'how-to-merge-multiple-pdfs-online', '2026-06-10')],
  },
  {
    path: '/blog/pdf-vs-docx-which-format-should-you-use',
    title: 'PDF vs DOCX: Which Document Format Should You Use?',
    description:
      'PDF vs DOCX comparison. Learn when to use PDF and when to use Word format. Understand the pros, cons, and best use cases for each document format.',
    keywords: 'pdf vs docx, pdf vs word, difference between pdf and docx, when to use pdf, when to use word',
    heading: 'PDF vs DOCX: Which Document Format Should You Use?',
    content:
      'PDF and DOCX are the two most popular document formats in the world. Every day, billions of documents are created, shared, and stored in these formats. Understanding when to use each format can save you time, prevent formatting headaches, and ensure your documents look professional.',
    breadcrumbs: [['Home', '/'], ['Blog', '/blog'], ['PDF vs DOCX']],
    ogType: 'article',
    schemas: [blogPosting('PDF vs DOCX: Which Document Format Should You Use?', 'PDF vs DOCX comparison. Learn when to use PDF and when to use Word format.', 'pdf-vs-docx-which-format-should-you-use', '2026-06-05')],
  },
  {
    path: '/blog/convert-pdf-to-word-without-adobe',
    title: 'How to Convert PDF to Word Without Adobe — Free Methods',
    description:
      'Convert PDF to Word without Adobe Acrobat. 5 free methods that work in 2026. No software installation needed. Step-by-step instructions included.',
    keywords: 'convert pdf to word without adobe, pdf to word free, pdf to word no adobe, free pdf to word converter',
    heading: 'How to Convert PDF to Word Without Adobe — Free Methods',
    content:
      'Adobe Acrobat Pro costs $19.99 per month — that is nearly $240 per year just to convert PDFs. The truth is, there are excellent free alternatives that convert PDF to Word with impressive accuracy. Learn 5 different free methods with step-by-step instructions.',
    breadcrumbs: [['Home', '/'], ['Blog', '/blog'], ['PDF to Word Without Adobe']],
    ogType: 'article',
    schemas: [blogPosting('How to Convert PDF to Word Without Adobe — Free Methods', 'Convert PDF to Word without Adobe Acrobat. 5 free methods that work in 2026.', 'convert-pdf-to-word-without-adobe', '2026-06-01')],
  },
  {
    path: '/blog/top-10-free-online-pdf-tools-2026',
    title: 'Top 10 Free Online PDF Tools You Need in 2026',
    description:
      'Discover the 10 best free online PDF tools in 2026. Edit, convert, merge, split, compress, and protect PDFs without paying a cent. Complete guide with recommendations.',
    keywords: 'free pdf tools, online pdf tools, best pdf tools 2026, free pdf editor, pdf tools online free',
    heading: 'Top 10 Free Online PDF Tools You Need in 2026',
    content:
      'PDFs run the modern world. Contracts, invoices, reports, academic papers, government forms — if it is important, it is probably a PDF. Here are the 10 PDF tools every student, professional, and creator should know about in 2026.',
    breadcrumbs: [['Home', '/'], ['Blog', '/blog'], ['Top PDF Tools 2026']],
    ogType: 'article',
    schemas: [blogPosting('Top 10 Free Online PDF Tools You Need in 2026', 'Discover the 10 best free online PDF tools in 2026.', 'top-10-free-online-pdf-tools-2026', '2026-05-28')],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — PdfNest',
    description:
      'PdfNest Privacy Policy. Learn how we handle your data. All file processing happens locally in your browser — we never upload or store your files.',
    keywords: 'pdfnest privacy policy, pdf tools privacy, browser-based privacy',
    heading: 'Privacy Policy',
    content:
      'At PdfNest, privacy is our core principle. All file processing happens locally in your browser using JavaScript. Your files are never uploaded to any server. We do not store, share, or collect your documents.',
  },
  {
    path: '/terms',
    title: 'Terms of Service — PdfNest',
    description:
      'PdfNest Terms of Service. Read our terms and conditions for using our free online PDF and document tools.',
    keywords: 'pdfnest terms of service, pdfnest terms, pdf tools terms',
    heading: 'Terms of Service',
    content:
      'By using PdfNest, you agree to these terms of service. Our tools are provided free of charge for personal and professional use. All processing is browser-based and your data stays on your device.',
  },
  {
    path: '/contact',
    title: 'Contact PdfNest — Get in Touch',
    description:
      'Contact the PdfNest team. Have a question, suggestion, or found a bug? We would love to hear from you.',
    keywords: 'contact pdfnest, pdfnest support, pdfnest feedback',
    heading: 'Contact Us',
    content:
      'Have a question or feedback about PdfNest? We would love to hear from you. Reach out to our team and we will get back to you as soon as possible. Email: sayadulmorsalin123@gmail.com',
  },
];

// ─── HTML Generation ──────────────────────────────────────────────────────────

/** Safely escape characters for HTML attribute values */
function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateHtml(baseHtml, route) {
  const fullTitle = route.title.includes('PdfNest') ? route.title : `${route.title} | PdfNest`;
  const formattedPath = route.path === '/' ? '/' : (route.path.endsWith('/') ? route.path : `${route.path}/`);
  const canonicalUrl = `${SITE_URL}${formattedPath}`;
  const ogType = route.ogType || 'website';

  // Build schema scripts
  const schemaScripts = (route.schemas || [])
    .map(s => `  <script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n');

  // SEO head block — injected at start of <head>
  const seoBlock = `
  <!-- Prerendered SEO for ${route.path} -->
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(route.description)}" />
  <meta name="keywords" content="${esc(route.keywords || '')}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${esc(fullTitle)}" />
  <meta property="og:description" content="${esc(route.description)}" />
  <meta property="og:image" content="${DEFAULT_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="PdfNest — Free Online PDF Tools" />
  <meta property="og:site_name" content="PdfNest" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:title" content="${esc(fullTitle)}" />
  <meta name="twitter:description" content="${esc(route.description)}" />
  <meta name="twitter:image" content="${DEFAULT_IMAGE}" />
${schemaScripts}
  <!-- /Prerendered SEO -->`;

  // Static body content — visible to crawlers without JS
  const breadcrumbHtml = route.breadcrumbs
    ? `<nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#888;margin-bottom:1rem">
      <ol style="list-style:none;display:flex;flex-wrap:wrap;gap:0.25rem;padding:0;margin:0">
        ${route.breadcrumbs.map(([name, url], i) =>
          `<li>${i > 0 ? '<span aria-hidden="true"> › </span>' : ''}${url ? `<a href="${url}" style="color:#888">${esc(name)}</a>` : `<span>${esc(name)}</span>`}</li>`
        ).join('')}
      </ol>
    </nav>`
    : '';

  const staticContent = `<div style="font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:1rem">
    <header style="margin-bottom:2rem">
      <a href="/" style="text-decoration:none;color:inherit;font-weight:bold;font-size:1.25rem">PdfNest</a>
      <nav aria-label="Main navigation" style="display:inline-flex;gap:1rem;margin-left:2rem;font-size:0.875rem">
        <a href="/" style="color:#888">Home</a>
        <a href="/pdf-editor" style="color:#888">PDF Editor</a>
        <a href="/merge-pdf" style="color:#888">Merge PDF</a>
        <a href="/compress-pdf" style="color:#888">Compress PDF</a>
        <a href="/split-pdf" style="color:#888">Split PDF</a>
        <a href="/compress-docx" style="color:#888">Compress DOCX</a>
        <a href="/compress-pptx" style="color:#888">Compress PPTX</a>
        <a href="/blog" style="color:#888">Blog</a>
      </nav>
    </header>
    <main>
      ${breadcrumbHtml}
      <h1 style="font-size:2rem;font-weight:700;margin-bottom:1rem">${esc(route.heading)}</h1>
      <p style="font-size:1.1rem;color:#555;line-height:1.7;margin-bottom:2rem">${esc(route.content)}</p>
      <p style="color:#777;font-size:0.875rem">Loading interactive tool — please enable JavaScript for full functionality.</p>
    </main>
    <footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #eee;font-size:0.8rem;color:#999">
      <p>PdfNest — Free Online PDF Tools. All processing is 100% browser-based. Your files never leave your device.</p>
      <nav style="display:flex;gap:1rem;margin-top:0.5rem">
        <a href="/privacy" style="color:#999">Privacy Policy</a>
        <a href="/terms" style="color:#999">Terms of Service</a>
        <a href="/contact" style="color:#999">Contact</a>
        <a href="/blog" style="color:#999">Blog</a>
      </nav>
    </footer>
  </div>`;

  // Apply injections to the base HTML
  let html = baseHtml;

  // Step 1: Remove duplicate/stale meta tags from the static fallback in index.html
  // (react-helmet-async handles these client-side; we inject fresh ones above)
  html = html.replace(/<title>[^<]*<\/title>/g, '');
  html = html.replace(/<meta\s+name="description"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="keywords"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="robots"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="googlebot"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="language"[^>]*>/g, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
  // Remove stale prerender comment blocks if any
  html = html.replace(/\s*<!-- Prerendered SEO[\s\S]*?\/Prerendered SEO -->/g, '');

  // Step 2: Inject SEO block at start of <head>
  html = html.replace('<head>', `<head>\n${seoBlock}`);

  // Step 3: Replace the empty root div with static content
  html = html.replace(/<div\s+id="root"><\/div>/, `<div id="root">${staticContent}</div>`);

  return html;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const baseHtmlPath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error(`ERROR: ${baseHtmlPath} not found. Run 'vite build' first.`);
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');
let successCount = 0;
let errorCount = 0;

console.log(`\nPrerendering ${ROUTES.length} routes...\n`);

for (const route of ROUTES) {
  try {
    const html = generateHtml(baseHtml, route);

    // Determine output file path
    const outputPath =
      route.path === '/'
        ? path.resolve(distDir, 'index.html')
        : path.resolve(distDir, route.path.replace(/^\//, ''), 'index.html');

    // Create directory if needed
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the prerendered HTML
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`  ✓ ${route.path}`);
    successCount++;
  } catch (err) {
    console.error(`  ✗ ${route.path}: ${err.message}`);
    errorCount++;
  }
}

console.log(`\nPrerendering complete: ${successCount} succeeded, ${errorCount} failed.\n`);
if (errorCount > 0) process.exit(1);
