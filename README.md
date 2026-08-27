# 📄 PdfNest — All-in-One Privacy-First PDF, Office & Developer Utility Hub

[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-success?style=for-the-badge&logo=shield)](https://pdfnest.shop)
[![Live Site](https://img.shields.io/badge/Live_Site-pdfnest.shop-blue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://pdfnest.shop)

> **PdfNest** is a modern, high-performance, privacy-first web application offering a comprehensive suite of PDF manipulation, Office document compression, developer tools, and academic utilities. Designed with a **Privacy-First** architecture, all primary operations run locally inside your browser using WebAssembly and modern JavaScript APIs — your files never leave your device.

---

## 📑 Table of Contents

- [✨ Key Highlights](#-key-highlights)
- [🛠️ Feature Matrix & Tool Suite](#️-feature-matrix--tool-suite)
  - [1. PDF Tools (10 Tools)](#1-pdf-tools-10-tools)
  - [2. Office Document Compression (2 Tools)](#2-office-document-compression-2-tools)
  - [3. Developer Utilities (2 Tools)](#3-developer-utilities-2-tools)
  - [4. Image Utilities (1 Tool)](#4-image-utilities-1-tool)
  - [5. Academic & Student Tools (1 Tool)](#5-academic--student-tools-1-tool)
  - [6. Guides & SEO Knowledge Hub](#6-guides--seo-knowledge-hub)
- [🏗️ Technical Architecture & Hybrid Fallback Engine](#️-technical-architecture--hybrid-fallback-engine)
  - [Architecture Workflow](#architecture-workflow)
  - [Processing Tier Breakdown](#processing-tier-breakdown)
- [💻 Tech Stack & Libraries](#-tech-stack--libraries)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App Locally](#running-the-app-locally)
- [🔌 High-Fidelity Backend Server (Optional)](#-high-fidelity-backend-server-optional)
  - [Backend Endpoints](#backend-endpoints)
  - [PowerShell COM & LibreOffice Setup](#powershell-com--libreoffice-setup)
- [📜 Available Scripts](#-available-scripts)
- [🌐 SEO, Schema.org & SSG Pre-rendering Pipeline](#-seo-schemaorg--ssg-pre-rendering-pipeline)
- [🚢 Deployment Guide](#-deployment-guide)
  - [Deploy to Netlify (Recommended)](#deploy-to-netlify-recommended)
  - [Deploy to Vercel](#deploy-to-vercel)
  - [Self-Hosted Production Server](#self-hosted-production-server)
- [🔒 Privacy & Security Blueprint](#-privacy--security-blueprint)
- [🤝 Contributing](#-contributing)
- [📄 License & Author](#-license--author)

---

## ✨ Key Highlights

- 🔒 **100% Client-Side Privacy**: PDF merging, splitting, image compression, formatting, and standard conversions execute entirely within the user's browser memory. No documents are stored, tracked, or uploaded to external servers.
- ⚡ **Instant Zero-Lag Processing**: Powered by WebAssembly (`@docmentis/udoc-viewer`), `pdf-lib`, `pdfjs-dist` (via dedicated Web Workers), and `jspdf` for instantaneous file processing without server queue delays.
- 🔄 **Hybrid Dual-Engine Architecture**: Intelligent dual-layer processing — seamless in-browser WASM conversion paired with an optional local backend leveraging Microsoft Office COM Automation & headless LibreOffice for 100% desktop-grade document fidelity.
- 🗜️ **Deep Media Optimization for Office Files**: Specialized DOCX & PPTX compressors unpack OpenXML archives via `jszip`, re-encode high-res embedded raster assets with customizable quality presets, and repack with maximum DEFLATE compression (handling 300MB+ decks).
- 🎨 **Modern Glassmorphic UI**: Sleek, responsive design built with Tailwind CSS v4, dynamic light/dark mode theming, Framer Motion micro-animations, and an interactive global tool search modal (`Ctrl + K`).
- 🔍 **Zero-Dependency SSG Pre-rendering Pipeline**: Custom static site generation script (`scripts/prerender.js`) injecting rich Schema.org JSON-LD structured data (`SoftwareApplication`, `BreadcrumbList`, `BlogPosting`, `WebSite`) into pre-built static HTML pages for optimal SEO.

---

## 🛠️ Feature Matrix & Tool Suite

### 1. PDF Tools (10 Tools)

| Tool | Route | Description | Engine / Libraries |
| :--- | :--- | :--- | :--- |
| **Merge PDF** | [`/merge-pdf/`](https://pdfnest.shop/merge-pdf/) | Combine multiple PDF files into one ordered document with visual drag-and-drop reordering. | `pdf-lib` |
| **Split PDF** | [`/split-pdf/`](https://pdfnest.shop/split-pdf/) | Extract custom page ranges (e.g. `1-3, 5, 7-10`) or extract all pages as individual PDFs zipped together. | `pdf-lib` + `jszip` |
| **Compress PDF** | [`/compress-pdf/`](https://pdfnest.shop/compress-pdf/) | Reduce PDF file size with Low, Recommended, and High compression presets via canvas re-rasterization. | `pdfjs-dist` + `jspdf` |
| **PDF to Word** | [`/pdf-to-word/`](https://pdfnest.shop/pdf-to-word/) | Convert PDF into editable `.docx` with headings, bold/italic text, bullet points, font detection, and fallback image preservation. | `docx` + `pdfjs-dist` / MS Word COM |
| **Word to PDF** | [`/word-to-pdf/`](https://pdfnest.shop/word-to-pdf/) | Convert Word `.docx` documents to standard PDF files directly in the browser with full formatting. | `@docmentis/udoc-viewer` + `jspdf` |
| **PDF to PowerPoint** | [`/pdf-to-pptx/`](https://pdfnest.shop/pdf-to-pptx/) | Render PDF pages into high-resolution PowerPoint `.pptx` presentation slides with text hierarchy. | `pptxgenjs` + `pdfjs-dist` |
| **PowerPoint to PDF** | [`/pptx-to-pdf/`](https://pdfnest.shop/pptx-to-pdf/) | Convert `.pptx` presentations into multi-page PDFs with preserved slide orientations. | `@docmentis/udoc-viewer` + `jspdf` |
| **PDF to JPG** | [`/pdf-to-jpg/`](https://pdfnest.shop/pdf-to-jpg/) | Extract all PDF pages as high-resolution JPEG images zipped in a single download archive. | `pdfjs-dist` + `jszip` |
| **PDF to PNG** | [`/pdf-to-png/`](https://pdfnest.shop/pdf-to-png/) | Convert PDF pages into lossless, crisp PNG image files packaged in a ZIP container. | `pdfjs-dist` + `jszip` |
| **PDF Editor** | [`/pdf-editor/`](https://pdfnest.shop/pdf-editor/) | All-in-one consolidated workspace for converting, merging, splitting, and compressing PDFs in one tabbed interface. | Unified Multi-Tool Interface |

### 2. Office Document Compression (2 Tools)

| Tool | Route | Description | Engine / Libraries |
| :--- | :--- | :--- | :--- |
| **Compress DOCX** | [`/compress-docx/`](https://pdfnest.shop/compress-docx/) | Unpacks `.docx` archives, re-encodes embedded high-res images at customizable quality, and repacks with maximum DEFLATE compression. | `jszip` + Browser Canvas API |
| **Compress PPTX** | [`/compress-pptx/`](https://pdfnest.shop/compress-pptx/) | Optimizes embedded media, images, and slide assets inside `.pptx`/`.ppsx` bundles. Easily compresses heavy 300MB+ decks under email limits. | `jszip` + Browser Canvas API |

### 3. Developer Utilities (2 Tools)

| Tool | Route | Description | Engine / Libraries |
| :--- | :--- | :--- | :--- |
| **JSON Formatter** | [`/json-formatter/`](https://pdfnest.shop/json-formatter/) | Real-time JSON syntax validation, error location pointer, 2-space beautification, and single-line minification. | Native `JSON` Parser |
| **Code Formatter** | [`/code-formatter/`](https://pdfnest.shop/code-formatter/) | Beautify and minify JavaScript, JSON, HTML, and CSS source code with real-time syntax highlighting. | PrismJS & Custom Formatters |

### 4. Image Utilities (1 Tool)

| Tool | Route | Description | Engine / Libraries |
| :--- | :--- | :--- | :--- |
| **Image Compressor** | [`/image-compressor/`](https://pdfnest.shop/image-compressor/) | Client-side compression for JPG, PNG, and WebP images with custom quality slider, reduction percentage counter, and live before/after preview. | `browser-image-compression` |

### 5. Academic & Student Tools (1 Tool)

| Tool | Route | Description | Engine / Libraries |
| :--- | :--- | :--- | :--- |
| **CGPA Calculator** | [`/cgpa-calculator/`](https://pdfnest.shop/cgpa-calculator/) | Calculates semester GPA and cumulative CGPA based on the official University Grants Commission (UGC) Bangladesh 4.0 grading system (DU, BUET, NSU, AIUB, BRACU, etc.). | Credit/Grade Weighted Formula |

### 6. Guides & SEO Knowledge Hub

| Resource | Route | Description |
| :--- | :--- | :--- |
| **Blog & Guides Hub** | [`/blog/`](https://pdfnest.shop/blog/) | Comprehensive guides covering PDF compression, PDF to Word conversion without Adobe, PPTX compression, PDF merging, and format comparisons. |

---

## 🏗️ Technical Architecture & Hybrid Fallback Engine

### Architecture Workflow

```
                             [ User Uploads Document ]
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
      [ Tier 1: Client-Side Engine ]            [ Tier 2: Local Server / API ]
      (Default — 100% In-Browser)              (Optional — High Fidelity)
                    │                                         │
      • @docmentis/udoc-viewer (WASM)           • MS Word COM Automation (.docx)
      • pdf-lib (Pure JS Manipulation)          • MS PowerPoint COM Automation (.pptx)
      • pdfjs-dist (Canvas Rendering & OCR)     • Headless LibreOffice Engine
      • docx / pptxgenjs / jszip                • Vercel Serverless Function (ConvertAPI)
      • browser-image-compression                             │
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         ▼
                              [ Output File Download ]
```

### Processing Tier Breakdown

1. **Client-First Tier (Default)**:
   - File processing begins instantaneously inside the user's web browser using Web Workers and WebAssembly.
   - Zero network transmission occurs, ensuring total data privacy, compliance with confidentiality standards, and zero server hosting bandwidth costs.
2. **Local High-Fidelity Tier (Optional)**:
   - For complex Word/PowerPoint conversions where native desktop formatting is required, the client checks if the local conversion server (`http://localhost:3001`) is running.
   - If online, it executes native Windows PowerShell COM Automation (`Word.Application` / `PowerPoint.Application`) or headless LibreOffice (`soffice`).
   - If the backend is unreachable or errors out, the frontend automatically and seamlessly falls back to the in-browser WASM/JS engine.
3. **Cloud Serverless Tier (Vercel)**:
   - Configured via `api/convert-pptx.js` for cloud-deployed PowerPoint conversions utilizing ConvertAPI when running in a serverless environment.

---

## 💻 Tech Stack & Libraries

### Frontend Core
- **Framework**: [React 19](https://react.dev/) (`react`, `react-dom`)
- **Build Tool & Bundler**: [Vite 8](https://vitejs.dev/) with `@vitejs/plugin-react`
- **Routing**: [React Router 7](https://reactrouter.com/) (`react-router-dom`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`tailwindcss`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **SEO & Meta**: [React Helmet Async](https://github.com/staylor/react-helmet-async)

### Document & Media Processing Engines
- **PDF Manipulation**: [`pdf-lib`](https://pdf-lib.js.org/) (merge, split, extract pages, copy buffer)
- **PDF Parsing & Rendering**: [`pdfjs-dist`](https://mozilla.github.io/pdf.js/) (rendered via dedicated Web Worker `public/pdf.worker.min.mjs`)
- **PDF Generation**: [`jspdf`](https://github.com/parallax/jsPDF) & [`html2canvas`](https://html2canvas.hertzen.com/)
- **Word (.docx) Generation**: [`docx`](https://docx.js.org/) (creates native OpenXML Word documents with styled paragraphs, headings, runs, and embedded images)
- **PowerPoint (.pptx) Generation**: [`pptxgenjs`](https://gitbrent.github.io/PptxGenJS/) (creates standard presentation decks with auto-layout)
- **WASM Document Viewer/Converter**: [`@docmentis/udoc-viewer`](https://www.npmjs.com/package/@docmentis/udoc-viewer)
- **Zip / Archive Engine**: [`jszip`](https://stuk.github.io/jszip/) (used for `.docx`/`.pptx` XML extraction and multi-file downloads)
- **Image Compression**: [`browser-image-compression`](https://github.com/Donaldcwl/browser-image-compression) & HTML5 Canvas 2D API
- **File Saving**: [`file-saver`](https://github.com/eligrey/FileSaver.js/)
- **Syntax Highlighting & Formatting**: `prismjs`, `react-simple-code-editor`, `react-markdown`, `prettier`

### Backend & Tooling
- **Server**: Node.js, Express 5, Cors, Multer
- **Automation**: Windows PowerShell COM Automation, Headless LibreOffice
- **Task Runner**: `concurrently` (runs backend + Vite concurrently during dev)

---

## 📂 Project Directory Structure

```text
PdfNest/
├── api/                             # Serverless API functions
│   └── convert-pptx.js              # Vercel serverless function (ConvertAPI handler)
├── dist/                            # Production build output & prerendered static pages
├── public/                          # Static public assets
│   ├── favicon.ico                  # Browser favicon
│   ├── image.png                    # Open Graph / Social card branding image
│   ├── manifest.json                # Progressive Web App manifest
│   ├── pdf.worker.min.mjs           # PDF.js Web Worker binary
│   ├── robots.txt                   # Search crawler directives
│   └── sitemap.xml                  # Canonical XML sitemap
├── scripts/
│   └── prerender.js                 # Zero-dependency Node.js SSG pre-renderer
├── src/
│   ├── assets/                      # UI illustrations, icons, and media
│   ├── components/                  # Reusable UI components
│   │   ├── Breadcrumb.jsx           # Breadcrumb navigation with Schema.org markup
│   │   ├── FAQSection.jsx           # Accordion FAQ component with JSON-LD support
│   │   ├── Footer.jsx               # Global footer with internal links & social profiles
│   │   ├── Layout.jsx               # Base layout shell with responsive container
│   │   ├── Navbar.jsx               # Glassmorphic header, theme toggle, mobile drawer & Ctrl+K search
│   │   ├── RelatedTools.jsx         # Internal linking tool cards and ALL_TOOLS registry
│   │   ├── ScrollToTop.jsx          # Route change scroll position restoration
│   │   ├── SEO.jsx                  # Dynamic Meta tags & JSON-LD schema injector
│   │   └── pdf/                     # Modular tool execution components
│   │       ├── CompressDocxTool.jsx # DOCX image optimizer & zipper
│   │       ├── CompressPptxTool.jsx # PPTX image optimizer & zipper
│   │       ├── CompressTool.jsx     # PDF compression engine
│   │       ├── MergeTool.jsx        # PDF merge & visual ordering interface
│   │       ├── PdfToJpgTool.jsx     # PDF to JPG image extractor
│   │       ├── PdfToPptxTool.jsx    # PDF to PowerPoint slide generator
│   │       ├── PdfToWordTool.jsx    # PDF to DOCX structural converter
│   │       ├── PptxToPdfTool.jsx    # PPTX to PDF converter
│   │       ├── SplitTool.jsx        # PDF page range splitter
│   │       └── WordToPdfTool.jsx    # Word to PDF converter
│   ├── data/
│   │   └── blogPosts.js             # Blog articles, guides, and markdown contents
│   ├── pages/                       # Route view components
│   │   ├── Blog.jsx                 # Blog index listing page
│   │   ├── BlogPost.jsx             # Individual blog post article viewer
│   │   ├── CgpaCalculator.jsx       # Bangladesh UGC 4.0 grading CGPA calculator
│   │   ├── CodeFormatter.jsx        # JS/HTML/CSS/JSON code formatter
│   │   ├── Contact.jsx              # Contact & support page
│   │   ├── Home.jsx                 # Landing page with tool search, category filters & FAQs
│   │   ├── ImageCompressor.jsx      # Image compression workbench
│   │   ├── JsonFormatter.jsx        # JSON validator, beautifier & minifier
│   │   ├── PdfEditor.jsx            # All-in-one consolidated PDF workspace
│   │   ├── Privacy.jsx              # Privacy policy
│   │   ├── Terms.jsx                # Terms of service
│   │   └── tools/                   # Dedicated tool landing pages (SEO optimized)
│   │       ├── CompressDocx.jsx
│   │       ├── CompressPdf.jsx
│   │       ├── CompressPptx.jsx
│   │       ├── MergePdf.jsx
│   │       ├── PdfToJpg.jsx
│   │       ├── PdfToPng.jsx
│   │       ├── PdfToPptx.jsx
│   │       ├── PdfToWord.jsx
│   │       ├── PptxToPdf.jsx
│   │       ├── SplitPdf.jsx
│   │       └── WordToPdf.jsx
│   ├── utils/                       # Conversion utilities & worker helpers
│   │   ├── pdfConverter.js          # Text hierarchy classification & PPTX builder
│   │   ├── pdfWorker.js             # PDF.js Web Worker initializer
│   │   ├── pptxConverter.js         # PowerPoint conversion pipelines
│   │   ├── serverConverter.js       # Local backend API client & health check
│   │   └── wordConverter.js         # DOCX builder, paragraph & style parser
│   ├── App.jsx                      # Main React router configuration
│   ├── index.css                    # Tailwind CSS v4 design tokens & base styles
│   └── main.jsx                     # Application entry point & Helmet provider
├── index.html                       # HTML template with SEO fallbacks & Google AdSense
├── netlify.toml                     # Netlify build settings, caching headers & 301 redirects
├── package.json                     # Project manifest and dependencies
├── server.js                        # Express conversion server (COM / LibreOffice)
├── tailwind.config.js               # Tailwind configuration
├── vercel.json                      # Vercel deployment routing & headers
└── vite.config.js                   # Vite bundler configuration & API proxy
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20+` recommended)
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sayedulmorsalin/PdfNest.git
   cd PdfNest
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

### Running the App Locally

Start both the Vite frontend and the Express document backend concurrently:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend Conversion API**: `http://localhost:3001`

To run **only the Vite frontend** (pure client-side mode):
```bash
npx vite
```

---

## 🔌 High-Fidelity Backend Server (Optional)

The optional Node.js conversion backend provides pixel-perfect desktop fidelity for complex Word and PowerPoint conversions using native OS automation.

To start only the backend server:

```bash
npm run server
```

### Backend Endpoints

| Method | Endpoint | Description | Expected Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning engine status | None |
| `POST` | `/api/convert/word-to-pdf` | Convert `.docx`/`.doc` to `.pdf` | `multipart/form-data` (`file`) |
| `POST` | `/api/convert/pdf-to-word` | Convert `.pdf` to `.docx` | `multipart/form-data` (`file`) |
| `POST` | `/api/convert/pptx-to-pdf` | Convert `.pptx`/`.ppt` to `.pdf` | `multipart/form-data` (`file`) |
| `POST` | `/api/convert/pdf-to-pptx` | Convert `.pdf` to `.pptx` | `multipart/form-data` (`file`) |

### PowerShell COM & LibreOffice Setup

- **Windows OS**: If Microsoft Office (Word and PowerPoint) is installed, the server automatically executes COM automation scripts.
- **Cross-Platform / Fallback**: If Microsoft Office is not available, the server automatically attempts to invoke headless LibreOffice (`soffice` CLI). Ensure LibreOffice is installed and available in your system `PATH`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Node.js backend server (`server.js`) and Vite dev server concurrently. |
| `npm run server` | Starts only the Express.js document conversion backend on port `3001`. |
| `npm run build` | Builds the production bundle using Vite and runs `scripts/prerender.js` for SSG static generation. |
| `npm run preview` | Starts a local server to preview the production `dist/` build. |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors across all files. |

---

## 🌐 SEO, Schema.org & SSG Pre-rendering Pipeline

PdfNest features an automated **Zero-Dependency Static Site Generation (SSG)** script located at [`scripts/prerender.js`](file:///d:/all%20code/web%20project/All-in-one/scripts/prerender.js):

1. **Automated Build Integration**: Runs automatically following `vite build` during `npm run build`.
2. **Static Route Pre-rendering**: Reads `dist/index.html` and creates isolated `dist/<route>/index.html` static files for every tool route, blog post, and static page.
3. **Structured Data Injection**: Embeds comprehensive Schema.org JSON-LD schemas directly into the `<head>` of each static page:
   - `WebSite` & `SearchAction`
   - `SoftwareApplication` (specifying features, operating system, and free pricing offers)
   - `BreadcrumbList` (hierarchical breadcrumbs for all tool routes)
   - `BlogPosting` (with publish dates, authors, tags, and publisher info)
   - `FAQPage` (FAQ questions and answers for tool and blog routes)
4. **Instant Crawler Indexability**: Search engines (Googlebot, Bingbot, DuckDuckBot) receive clean HTML content and metadata immediately without having to execute JavaScript.

---

## 🚢 Deployment Guide

### Deploy to Netlify (Recommended)

PdfNest is pre-configured with a comprehensive [`netlify.toml`](file:///d:/all%20code/web%20project/All-in-one/netlify.toml):
- Automatic build and pre-rendering via `npm run build`.
- Output directory: `dist`.
- 1-year immutable caching for static assets (`/assets/*`, `/pdf.worker.min.mjs`).
- 301 trailing-slash normalization redirects for clean SEO URLs.
- SPA fallback routing (`/* -> /index.html 200`).

```bash
# Push your code to GitHub/GitLab and link the repository to Netlify
Build Command: npm run build
Publish Directory: dist
Node Version: 20
```

### Deploy to Vercel

Configured via [`vercel.json`](file:///d:/all%20code/web%20project/All-in-one/vercel.json):
1. Import the repository into your Vercel dashboard.
2. Build command: `npm run build`
3. Output directory: `dist`
4. *(Optional)* Under **Project Settings -> Environment Variables**, add `CONVERTAPI_SECRET` for cloud PowerPoint conversion fallback.

### Self-Hosted Production Server

To host both the client and server on a VPS or dedicated machine:

```bash
# 1. Build the frontend
npm run build

# 2. Start the backend conversion server
NODE_ENV=production node server.js
```

---

## 🔒 Privacy & Security Blueprint

- 🛡️ **Zero Server Storage**: Files processed client-side are stored strictly in temporary browser RAM and discarded upon download or tab close.
- 🚫 **No Tracking of Document Data**: PdfNest does not collect, log, or sell file names, file contents, or personal information.
- 🔐 **Ephemeral Local File Cleanup**: If utilizing the local COM conversion server, uploaded temporary files in the `uploads/` directory are immediately deleted once the output file is delivered to the client.
- 🛡️ **Robust Security Headers**: Configured with strict HTTP security headers including `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and restricted permissions policies.

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are warmly welcomed!

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add amazing new tool'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

---

## 📄 License & Author

Distributed under the **MIT License**. See `LICENSE` for more information.

Developed with ❤️ by **[Sayedul Morsalin](https://github.com/sayedulmorsalin)**
- 🌐 **Portfolio**: [sayedulmarsalin.vercel.app](https://sayedulmarsalin.vercel.app/)
- 💻 **GitHub**: [@sayedulmorsalin](https://github.com/sayedulmorsalin)
- ✉️ **Email**: [sayadulmorsalin123@gmail.com](mailto:sayadulmorsalin123@gmail.com)
