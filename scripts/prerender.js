/**
 * prerender.js — High-Performance Static HTML Prerenderer with Rich SEO
 *
 * Generates crawlable, SEO-rich static HTML for all routes:
 *  1. Injects complete meta tags, OpenGraph, Twitter Cards, and canonical links.
 *  2. Injects rich JSON-LD schemas: SoftwareApplication, BreadcrumbList, FAQPage, BlogPosting.
 *  3. Injects full textual content:
 *     - Tool pages: Detailed descriptions, step-by-step How-To guides, features, and full FAQ sections.
 *     - Blog pages: Full article text (all sections, headings, tables, lists) from src/data/blogPosts.js.
 *  4. Crawlers (Googlebot, Bingbot) receive comprehensive 800–2,500 word pages instead of thin stubs.
 *  5. React still hydrates client-side seamlessly for interactive features.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import blogPosts from '../src/data/blogPosts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://pdfnest.shop';
const DEFAULT_IMAGE = `${SITE_URL}/image.png?v=2`;

// Load tool FAQs
const toolFaqsPath = path.resolve(__dirname, 'toolFaqs.json');
let toolFaqsMap = {};
if (fs.existsSync(toolFaqsPath)) {
  try {
    toolFaqsMap = JSON.parse(fs.readFileSync(toolFaqsPath, 'utf8'));
  } catch (e) {
    console.warn('Could not load toolFaqs.json:', e.message);
  }
}

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
      ...(url ? { item: `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}` } : {}),
    })),
  };
}

function faqSchema(faqs) {
  if (!faqs || !faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

function blogPosting(headline, description, slug, datePublished, dateModified) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    image: DEFAULT_IMAGE,
    author: { '@type': 'Organization', name: 'PdfNest', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'PdfNest',
      logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE },
    },
  };
}

// ─── Markdown to Clean HTML Formatter for Blog Posts ──────────────────────────

function formatInline(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#2563eb;text-decoration:underline">$1</a>')
    .replace(/`(.+?)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:0.9em;color:#0f172a">$1</code>');
}

function mdToHtml(md) {
  if (!md) return '';
  const blocks = md.split(/\n\s*\n/);
  return blocks
    .map(block => {
      block = block.trim();
      if (!block) return '';

      // Markdown Table
      if (block.startsWith('|')) {
        const lines = block.split('\n').filter(l => l.trim().startsWith('|'));
        if (lines.length >= 2) {
          const parseRow = line =>
            line
              .split('|')
              .slice(1, -1)
              .map(c => c.trim());
          const header = parseRow(lines[0]);
          const dataRows = lines.slice(2).map(parseRow);
          return `<table style="width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:0.95rem">
            <thead>
              <tr style="background:#f8fafc">
                ${header.map(h => `<th style="border:1px solid #e2e8f0;padding:10px 14px;text-align:left;font-weight:600;color:#0f172a">${formatInline(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${dataRows.map(row => `<tr>${row.map(c => `<td style="border:1px solid #e2e8f0;padding:10px 14px;color:#334155">${formatInline(c)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>`;
        }
      }

      // Unordered list
      if (block.startsWith('- ') || block.startsWith('* ')) {
        const items = block
          .split('\n')
          .map(l => l.replace(/^[-*]\s+/, '').trim())
          .filter(Boolean);
        return `<ul style="margin:1rem 0;padding-left:1.5rem;line-height:1.8;color:#334155">
          ${items.map(i => `<li style="margin-bottom:0.5rem">${formatInline(i)}</li>`).join('')}
        </ul>`;
      }

      // Ordered list
      if (/^\d+\.\s/.test(block)) {
        const items = block
          .split('\n')
          .map(l => l.replace(/^\d+\.\s+/, '').trim())
          .filter(Boolean);
        return `<ol style="margin:1rem 0;padding-left:1.5rem;line-height:1.8;color:#334155">
          ${items.map(i => `<li style="margin-bottom:0.5rem">${formatInline(i)}</li>`).join('')}
        </ol>`;
      }

      // Standard paragraph
      return `<p style="font-size:1.05rem;color:#334155;line-height:1.8;margin-bottom:1.25rem">${formatInline(block)}</p>`;
    })
    .join('\n');
}

// ─── Base Routes Definition ───────────────────────────────────────────────────

const BASE_ROUTES = [
  {
    path: '/',
    title: 'PdfNest | Free Online PDF Editor, Compress, Convert & Merge PDFs (No Uploads)',
    description:
      'PdfNest: 100% Free online tools for PDF editing, conversion, and compression. Merge PDFs, convert PDF to Word, split pages, compress PPTX/DOCX, format JSON. 100% browser-based — your files never leave your device.',
    keywords:
      'free PDF editor, compress PDF, merge PDF, split PDF, PDF to Word, Word to PDF, PDF to JPG, compress DOCX, compress PPTX, JSON formatter, image compressor, online tools, pdfnest.shop',
    heading: 'All Your PDF & Document Tools in One Place — 100% Free & Private',
    content:
      'Fast, free, and privacy-focused online tools for professionals, students, and developers. No accounts, no paywalls, and no tracking. All operations run directly in your browser using local device memory — your files are NEVER uploaded to any cloud server.',
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
    title: 'Professional PDF Editor Free — Convert PDF to Word, Merge & Split Online',
    description:
      'Free online PDF editor to convert PDF to Word with preserved formatting, PDF to PowerPoint, merge, split, and compress PDFs. 100% browser-based for maximum security.',
    keywords:
      'PDF to Word, free PDF editor, merge PDF, split PDF, compress PDF, PDF to PPTX, browser-based PDF editor, edit PDF online',
    heading: 'All-in-One Online PDF Editor',
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
    title: 'Merge PDF Online Free — Combine PDF Files Instantly (No Limits)',
    description:
      'Merge multiple PDF files into one document for free. No watermarks, no file limits, no registration. Fast, secure, browser-based PDF merger.',
    keywords: 'merge pdf, merge pdf online, combine pdf, merge pdf free, combine pdf files, pdf merger online',
    heading: 'Merge PDF Online — Combine Files for Free',
    content:
      'Combine multiple PDF files into one document instantly. Upload your PDFs, arrange them in order, and merge them with a single click. 100% browser-based — your files never leave your device. No watermarks, no registration required.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Merge PDF']],
    schemas: [
      softwareApp('PdfNest PDF Merger', 'Free online tool to merge multiple PDF files into one document.', [
        'Unlimited merges',
        'Drag to reorder',
        'Browser-based processing',
        'No watermarks',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Merge PDF']]),
    ],
  },
  {
    path: '/compress-pdf',
    title: 'Compress PDF Online Free — Reduce PDF File Size Without Losing Quality',
    description:
      'Compress PDF files online for free. Reduce PDF file size up to 80% without losing text or image quality. No watermarks, no registration, 100% browser-based.',
    keywords:
      'compress pdf, reduce pdf size, compress pdf online, pdf compressor, shrink pdf, compress pdf free, reduce pdf file size',
    heading: 'Compress PDF Online — Reduce File Size for Free',
    content:
      'Shrink your PDF files by up to 80% without visible quality loss. Choose Low, Recommended, or High compression. Perfect for email attachments, uploads, and storage. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress PDF']],
    schemas: [
      softwareApp('PdfNest PDF Compressor', 'Free online tool to compress and reduce PDF file size without quality loss.', [
        'Smart compression',
        'No quality loss',
        'Browser-based processing',
        'No watermarks',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress PDF']]),
    ],
  },
  {
    path: '/split-pdf',
    title: 'Split PDF Online Free — Extract Pages from PDF in Seconds',
    description:
      'Split PDF files and extract pages for free. Separate PDF pages, extract specific page ranges, or split into individual files. No watermarks, no registration required.',
    keywords:
      'split pdf, split pdf online, extract pages from pdf, split pdf free, separate pdf pages, pdf splitter, extract pdf pages',
    heading: 'Split PDF Online — Extract Pages for Free',
    content:
      'Separate your PDF into individual pages or extract specific page ranges. Select pages by number or range, then download as a new PDF. Fast, free, and completely private — no server uploads required.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Split PDF']],
    schemas: [
      softwareApp('PdfNest PDF Splitter', 'Free online tool to split PDF files and extract specific pages.', [
        'Extract specific pages',
        'Split by page range',
        'Split into individual files',
        'Browser-based',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Split PDF']]),
    ],
  },
  {
    path: '/pdf-to-word',
    title: 'PDF to Word Converter Free — Convert PDF to DOCX with Preserved Formatting',
    description:
      'Convert PDF files to editable Word documents (.docx) with preserved formatting, headings, and bullet points. 100% browser-based — your files never leave your device. No watermarks, no registration.',
    keywords:
      'pdf to word, convert pdf to word, pdf to docx, pdf to word converter, pdf to word free, edit pdf online, pdf to word without adobe, free pdf to word, convert pdf to docx online',
    heading: 'Convert PDF to Word — Free DOCX Converter',
    content:
      'Transform PDFs into fully editable Word (.docx) documents with preserved formatting, headings, and bullet points. Our smart parser detects font sizes, bold and italic text, and paragraph structure. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to Word']],
    schemas: [
      softwareApp(
        'PdfNest PDF to Word Converter',
        'Free online tool to convert PDF documents into editable Word (.docx) files.',
        [
          'Formatting preservation',
          'Heading detection (H1, H2)',
          'Bold and italic support',
          'Bullet point reconstruction',
          'Browser-based',
          'No watermarks',
          'Free unlimited use',
        ]
      ),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to Word']]),
    ],
  },
  {
    path: '/word-to-pdf',
    title: 'Word to PDF Converter Free — Convert DOCX to PDF Online Instantly',
    description:
      'Convert Word documents (.docx) to PDF online for free. Preserve all formatting, fonts, and layouts. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords:
      'word to pdf, convert word to pdf, docx to pdf, word to pdf converter, word to pdf free, convert docx to pdf online',
    heading: 'Convert Word to PDF — Free Online Converter',
    content:
      'Transform Word documents (.docx) into universally readable PDF files with preserved formatting. Upload your Word file and download a perfectly formatted PDF instantly. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Word to PDF']],
    schemas: [
      softwareApp('PdfNest Word to PDF Converter', 'Free online tool to convert Word documents into PDF files.', [
        'Formatting preservation',
        'Browser-based processing',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Word to PDF']]),
    ],
  },
  {
    path: '/pdf-to-jpg',
    title: 'PDF to JPG Converter Free — Convert PDF to High-Res Images Online',
    description:
      'Convert PDF pages to JPG images for free. High-quality PDF to image conversion. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords:
      'pdf to jpg, pdf to image, convert pdf to jpg, pdf to jpeg, pdf to jpg converter, pdf to image converter, pdf to jpg free',
    heading: 'Convert PDF to JPG — Free Image Converter',
    content:
      'Transform PDF pages into high-quality JPG images instantly. Perfect for presentations, social media, and sharing. Each page becomes a separate JPG image. Download individually or all pages as a zip file. 100% browser-based — completely private.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to JPG']],
    schemas: [
      softwareApp('PdfNest PDF to JPG Converter', 'Free online tool to convert PDF pages to high-quality JPG images.', [
        'High-resolution output',
        'Multi-page support',
        'Batch download',
        'Browser-based processing',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to JPG']]),
    ],
  },
  {
    path: '/pdf-to-png',
    title: 'PDF to PNG Converter Free — Convert PDF to Lossless PNG Online',
    description:
      'Convert PDF pages to lossless PNG images for free. High-quality PDF to PNG conversion. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords: 'pdf to png, convert pdf to png, pdf to png converter, pdf to png free, pdf pages to png images',
    heading: 'Convert PDF to PNG — Free Image Converter',
    content:
      'Transform PDF pages into lossless PNG images. Perfect for documents requiring transparency or crisp text quality. Each page becomes a separate high-resolution PNG. 100% browser-based — completely private.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to PNG']],
    schemas: [
      softwareApp('PdfNest PDF to PNG Converter', 'Free online tool to convert PDF pages to lossless PNG images.', [
        'Lossless quality',
        'Multi-page support',
        'Batch download',
        'Browser-based',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to PNG']]),
    ],
  },
  {
    path: '/pdf-to-pptx',
    title: 'PDF to PowerPoint Converter Free — Convert PDF to Slides Online',
    description:
      'Convert PDF files to PowerPoint presentations (.pptx) for free. Smart slide layout from PDF structure. No watermarks, no registration. Browser-based converter.',
    keywords: 'pdf to pptx, pdf to powerpoint, convert pdf to pptx, pdf to presentation, pdf to slides converter',
    heading: 'Convert PDF to PowerPoint — Free PPTX Converter',
    content:
      'Transform PDF documents into ready-to-present PowerPoint (.pptx) files. Our engine automatically paginates content and formats headers for slide titles. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to PowerPoint']],
    schemas: [
      softwareApp('PdfNest PDF to PowerPoint Converter', 'Free online tool to convert PDF documents into PowerPoint presentations.', [
        'Smart slide layout',
        'Browser-based processing',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PDF to PowerPoint']]),
    ],
  },
  {
    path: '/pptx-to-pdf',
    title: 'PowerPoint to PDF Converter Free — Convert PPTX to PDF Online',
    description:
      'Convert PowerPoint presentations (.pptx, .ppt) to PDF for free. Preserve formatting, fonts, and layouts. No watermarks, no registration. Fast, secure, browser-based converter.',
    keywords: 'powerpoint to pdf, convert pptx to pdf, pptx to pdf, pptx to pdf converter, powerpoint to pdf free',
    heading: 'Convert PowerPoint to PDF — Free Online Converter',
    content:
      'Transform PowerPoint presentations into universally readable PDF files with preserved formatting. Each slide is captured at high resolution. 100% browser-based — your files never leave your device.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PowerPoint to PDF']],
    schemas: [
      softwareApp('PdfNest PowerPoint to PDF Converter', 'Free online tool to convert PowerPoint presentations into PDF files.', [
        'Formatting preservation',
        'Browser-based processing',
        'Free unlimited use',
      ]),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['PowerPoint to PDF']]),
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
      softwareApp(
        'PdfNest Word Document Compressor',
        'Free online tool to compress Word documents (.docx) and reduce file size without losing formatting.',
        [
          'Compress Word document DOCX online',
          'Reduce Word file size free',
          'Preserve text formatting and tables',
          '100% private client-side processing',
          'No watermarks or registration',
        ]
      ),
      breadcrumbSchema([['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress DOCX', '/compress-docx/']]),
    ],
  },
  {
    path: '/compress-pptx',
    title: 'Compress PowerPoint Online Free – Reduce PPT & PPTX Size (300MB+) | PdfNest',
    description:
      'Compress PowerPoint files online for free. Reduce PPT, PPTX, and presentation file size (even 300MB+) without losing image quality or slide formatting. Fast, secure, 100% browser-based.',
    keywords:
      'compress powerpoint, ppt compressor, compress ppt, compress powerpoint file, ppt file compressor, compress ppt file, reduce ppt size online, compress ppt online more than 300mb free, compress pptx, free ppt compressor, compress powerpoint presentation, powerpoint size reducer, reduce pptx size online free, shrink powerpoint file, ppt size reducer',
    heading: 'Compress PowerPoint Files Online',
    content:
      'Reduce the file size of your PowerPoint presentations (.pptx, .ppsx) quickly and easily. 100% free and private — handles large 300MB+ decks without server limits. Smart image re-encoding and XML package compression directly in your browser.',
    breadcrumbs: [['Home', '/'], ['PDF Tools', '/pdf-editor/'], ['Compress PPTX']],
    schemas: [
      softwareApp(
        'PdfNest PowerPoint Compressor',
        'Free online tool to compress PowerPoint presentations (.pptx, .ppsx) and reduce file size without losing quality. Handles large files over 300MB.',
        [
          'Compress PPT and PPTX online',
          'Reduce PowerPoint size free',
          'Support for large files over 300MB',
          '100% private browser processing',
          'No quality loss option',
          'No watermarks or file limits',
        ]
      ),
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
        'JSON formatting',
        'JSON validation',
        'JSON minification',
        'Syntax highlighting',
        'Error detection',
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
        'JPEG compression',
        'PNG compression',
        'WebP support',
        'Browser-based',
        'Batch compression',
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
        'BD grading system',
        'Instant calculation',
        'Credit hour support',
        'Free unlimited use',
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
        'JavaScript formatting',
        'HTML formatting',
        'CSS formatting',
        'JSON formatting',
        'Prettier standards',
      ]),
    ],
  },
  {
    path: '/blog',
    title: 'PdfNest Blog — Expert PDF Tips, Document Guides & Tutorials',
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
        url: `${SITE_URL}/blog/`,
      },
      breadcrumbSchema([['Home', '/'], ['Blog', '/blog/']]),
    ],
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

// Attach tool FAQs and FAQ schema to base routes
for (const route of BASE_ROUTES) {
  const faqs = toolFaqsMap[route.path];
  if (faqs && faqs.length) {
    route.faqs = faqs;
    route.schemas = route.schemas || [];
    const schema = faqSchema(faqs);
    if (schema) route.schemas.push(schema);
  }
}

// Generate Blog Post routes directly from src/data/blogPosts.js
const BLOG_ROUTES = blogPosts.map(post => {
  const schemas = [
    blogPosting(post.title, post.metaDescription, post.slug, post.publishDate, post.dateModified),
    breadcrumbSchema([['Home', '/'], ['Blog', '/blog/'], [post.title, `/blog/${post.slug}/`]]),
  ];
  if (post.faqs && post.faqs.length) {
    schemas.push(faqSchema(post.faqs));
  }
  return {
    path: `/blog/${post.slug}`,
    title: `${post.title} | PdfNest`,
    description: post.metaDescription,
    keywords: post.keywords,
    heading: post.title,
    content: post.metaDescription,
    ogType: 'article',
    blogPost: post,
    breadcrumbs: [['Home', '/'], ['Blog', '/blog/'], [post.title]],
    schemas,
  };
});

const ALL_ROUTES = [...BASE_ROUTES, ...BLOG_ROUTES];

// ─── HTML Generation ──────────────────────────────────────────────────────────

/** Safely escape characters for HTML attribute values */
function esc(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateHtml(baseHtml, route) {
  const fullTitle = route.title.includes('PdfNest') ? route.title : `${route.title} | PdfNest`;
  const formattedPath = route.path === '/' ? '/' : route.path.endsWith('/') ? route.path : `${route.path}/`;
  const canonicalUrl = `${SITE_URL}${formattedPath}`;
  const ogType = route.ogType || 'website';

  // Build schema scripts
  const schemaScripts = (route.schemas || [])
    .filter(Boolean)
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

  // Breadcrumbs HTML
  const breadcrumbHtml = route.breadcrumbs
    ? `<nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#64748b;margin-bottom:1.5rem">
      <ol style="list-style:none;display:flex;flex-wrap:wrap;gap:0.35rem;padding:0;margin:0">
        ${route.breadcrumbs
          .map(
            ([name, url], i) =>
              `<li>${i > 0 ? '<span aria-hidden="true" style="color:#cbd5e1"> › </span>' : ''}${url ? `<a href="${url}" style="color:#2563eb;text-decoration:none">${esc(name)}</a>` : `<span style="color:#475569">${esc(name)}</span>`}</li>`
          )
          .join('')}
      </ol>
    </nav>`
    : '';

  // Main Body Content
  let mainBody = '';

  if (route.blogPost) {
    const post = route.blogPost;
    const formattedDate = new Date(post.publishDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    mainBody = `
      <article>
        ${breadcrumbHtml}
        <header style="margin-bottom:2.5rem;padding-bottom:1.5rem;border-bottom:1px solid #e2e8f0">
          <div style="display:flex;gap:0.75rem;align-items:center;margin-bottom:1rem;font-size:0.875rem;color:#64748b">
            <span style="background:#eff6ff;color:#2563eb;padding:3px 10px;border-radius:9999px;font-weight:600">${esc(post.category)}</span>
            <span>${formattedDate}</span>
            <span>•</span>
            <span>${esc(post.readTime)}</span>
          </div>
          <h1 style="font-size:2.25rem;font-weight:800;line-height:1.25;color:#0f172a;margin-bottom:1rem">${esc(post.title)}</h1>
          <p style="font-size:1.15rem;color:#475569;line-height:1.7">${esc(post.metaDescription)}</p>
        </header>

        <div style="line-height:1.8;color:#334155">
          ${post.sections
            .map(
              s => `
            <section style="margin-bottom:2.5rem">
              <h2 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin-bottom:1rem">${esc(s.heading)}</h2>
              <div>${mdToHtml(s.content)}</div>
            </section>
          `
            )
            .join('')}
        </div>

        ${
          post.faqs && post.faqs.length
            ? `
          <section style="margin-top:3rem;padding-top:2rem;border-top:1px solid #e2e8f0">
            <h2 style="font-size:1.75rem;font-weight:700;color:#0f172a;margin-bottom:1.5rem">Frequently Asked Questions</h2>
            ${post.faqs
              .map(
                f => `
              <article style="margin-bottom:1.5rem">
                <h3 style="font-size:1.15rem;font-weight:600;color:#0f172a;margin-bottom:0.4rem">${esc(f.q)}</h3>
                <p style="color:#475569;line-height:1.7;margin:0">${esc(f.a)}</p>
              </article>
            `
              )
              .join('')}
          </section>
        `
            : ''
        }
      </article>
    `;
  } else {
    // Tool or Standard Page
    const isTool = route.faqs && route.faqs.length > 0;

    const howToSection = isTool
      ? `
      <section style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;margin:2rem 0">
        <h2 style="font-size:1.35rem;font-weight:700;color:#0f172a;margin-bottom:1rem">How to Use ${esc(route.heading)}</h2>
        <ol style="margin:0;padding-left:1.5rem;line-height:1.8;color:#334155">
          <li><strong>Select or Upload File:</strong> Choose your file directly from your computer or mobile device.</li>
          <li><strong>100% Client-Side Processing:</strong> Your files never upload to any external server — processed completely within your browser.</li>
          <li><strong>Download Instantly:</strong> Save your converted, compressed, or edited file with zero watermarks or size caps.</li>
        </ol>
      </section>
      <section style="margin:2rem 0">
        <h2 style="font-size:1.35rem;font-weight:700;color:#0f172a;margin-bottom:0.75rem">Why Choose PdfNest?</h2>
        <ul style="margin:0;padding-left:1.5rem;line-height:1.8;color:#334155">
          <li><strong>Total Privacy Guarantee:</strong> Zero server uploads. Ideal for confidential contracts, financial sheets, and personal documents.</li>
          <li><strong>No File Size Restrictions:</strong> Compress or convert large files (300MB+) without "file too large" errors or queue waits.</li>
          <li><strong>100% Free Forever:</strong> No subscription, no credit card, no email registration, and no intrusive watermarks.</li>
        </ul>
      </section>
    `
      : '';

    const faqSection =
      route.faqs && route.faqs.length
        ? `
      <section style="margin-top:2.5rem;padding-top:2rem;border-top:1px solid #e2e8f0">
        <h2 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin-bottom:1.5rem">Frequently Asked Questions</h2>
        ${route.faqs
          .map(
            f => `
          <article style="margin-bottom:1.5rem">
            <h3 style="font-size:1.15rem;font-weight:600;color:#0f172a;margin-bottom:0.35rem">${esc(f.q)}</h3>
            <p style="color:#475569;line-height:1.7;margin:0">${esc(f.a)}</p>
          </article>
        `
          )
          .join('')}
      </section>
    `
        : '';

    mainBody = `
      <main>
        ${breadcrumbHtml}
        <h1 style="font-size:2.25rem;font-weight:800;color:#0f172a;margin-bottom:1rem">${esc(route.heading)}</h1>
        <p style="font-size:1.15rem;color:#475569;line-height:1.7;margin-bottom:1.5rem">${esc(route.content)}</p>
        ${howToSection}
        ${faqSection}
        <p style="color:#64748b;font-size:0.875rem;margin-top:2rem">Interactive tool loads directly below. Please ensure JavaScript is enabled in your browser.</p>
      </main>
    `;
  }

  const staticContent = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:960px;margin:0 auto;padding:2rem 1.5rem;color:#0f172a">
    <header style="margin-bottom:2.5rem;padding-bottom:1.25rem;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">
      <a href="/" style="text-decoration:none;color:#0f172a;font-weight:800;font-size:1.5rem;letter-spacing:-0.02em">PdfNest</a>
      <nav aria-label="Main navigation" style="display:flex;gap:1.25rem;font-size:0.9rem;flex-wrap:wrap">
        <a href="/" style="color:#475569;text-decoration:none">Home</a>
        <a href="/pdf-editor/" style="color:#475569;text-decoration:none">PDF Editor</a>
        <a href="/merge-pdf/" style="color:#475569;text-decoration:none">Merge PDF</a>
        <a href="/compress-pdf/" style="color:#475569;text-decoration:none">Compress PDF</a>
        <a href="/split-pdf/" style="color:#475569;text-decoration:none">Split PDF</a>
        <a href="/compress-docx/" style="color:#475569;text-decoration:none">Compress DOCX</a>
        <a href="/compress-pptx/" style="color:#475569;text-decoration:none">Compress PPTX</a>
        <a href="/blog/" style="color:#475569;text-decoration:none">Blog</a>
      </nav>
    </header>

    ${mainBody}

    <footer style="margin-top:4rem;padding-top:2rem;border-top:1px solid #e2e8f0;font-size:0.875rem;color:#64748b">
      <p style="margin:0 0 1rem 0"><strong>PdfNest</strong> — Free Online PDF Tools. All processing is 100% browser-based. Your files never leave your device.</p>
      <nav style="display:flex;gap:1.25rem">
        <a href="/privacy/" style="color:#64748b;text-decoration:none">Privacy Policy</a>
        <a href="/terms/" style="color:#64748b;text-decoration:none">Terms of Service</a>
        <a href="/contact/" style="color:#64748b;text-decoration:none">Contact</a>
        <a href="/blog/" style="color:#64748b;text-decoration:none">Blog</a>
      </nav>
    </footer>
  </div>`;

  // Apply injections to the base HTML
  let html = baseHtml;

  // Step 1: Remove duplicate/stale meta tags from the static fallback in index.html
  html = html.replace(/<title>[^<]*<\/title>/g, '');
  html = html.replace(/<meta\s+name="description"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="keywords"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="robots"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="googlebot"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="language"[^>]*>/g, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
  html = html.replace(/\s*<!-- Prerendered SEO[\s\S]*?\/Prerendered SEO -->/g, '');

  // Step 2: Inject SEO block at start of <head>
  html = html.replace('<head>', `<head>\n${seoBlock}`);

  // Step 3: Replace the empty root div with rich static content
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

console.log(`\nPrerendering ${ALL_ROUTES.length} routes with full content and rich schemas...\n`);

for (const route of ALL_ROUTES) {
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
    console.log(`  ✓ ${route.path} (${(html.length / 1024).toFixed(1)} KB)`);
    successCount++;
  } catch (err) {
    console.error(`  ✗ ${route.path}: ${err.message}`);
    errorCount++;
  }
}

console.log(`\nPrerendering complete: ${successCount} succeeded, ${errorCount} failed.\n`);
if (errorCount > 0) process.exit(1);
