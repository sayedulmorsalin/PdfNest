import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';

// Core pages
const Home = lazy(() => import('./pages/Home'));
const AllTools = lazy(() => import('./pages/AllTools'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// PDF & Office Tools (Code-split to keep initial bundle ultra-light)
const PdfEditor = lazy(() => import('./pages/PdfEditor'));
const MergePdf = lazy(() => import('./pages/tools/MergePdf'));
const CompressPdf = lazy(() => import('./pages/tools/CompressPdf'));
const SplitPdf = lazy(() => import('./pages/tools/SplitPdf'));
const PdfToWord = lazy(() => import('./pages/tools/PdfToWord'));
const WordToPdf = lazy(() => import('./pages/tools/WordToPdf'));
const PdfToJpg = lazy(() => import('./pages/tools/PdfToJpg'));
const PdfToPng = lazy(() => import('./pages/tools/PdfToPng'));
const PdfToPptx = lazy(() => import('./pages/tools/PdfToPptx'));
const PptxToPdf = lazy(() => import('./pages/tools/PptxToPdf'));
const CompressDocx = lazy(() => import('./pages/tools/CompressDocx'));
const CompressPptx = lazy(() => import('./pages/tools/CompressPptx'));

// Utilities
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'));
const ImageCompressor = lazy(() => import('./pages/ImageCompressor'));
const CgpaCalculator = lazy(() => import('./pages/CgpaCalculator'));
const CodeFormatter = lazy(() => import('./pages/CodeFormatter'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      <span className="text-xs text-muted-foreground animate-pulse">Loading tool workspace...</span>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-tools" element={<AllTools />} />
            <Route path="/all-tools/" element={<AllTools />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/" element={<About />} />

            {/* Document & PDF Tools */}
            <Route path="/pdf-editor" element={<PdfEditor />} />
            <Route path="/pdf-editor/" element={<PdfEditor />} />
            <Route path="/merge-pdf" element={<MergePdf />} />
            <Route path="/merge-pdf/" element={<MergePdf />} />
            <Route path="/compress-pdf" element={<CompressPdf />} />
            <Route path="/compress-pdf/" element={<CompressPdf />} />
            <Route path="/split-pdf" element={<SplitPdf />} />
            <Route path="/split-pdf/" element={<SplitPdf />} />
            <Route path="/pdf-to-word" element={<PdfToWord />} />
            <Route path="/pdf-to-word/" element={<PdfToWord />} />
            <Route path="/word-to-pdf" element={<WordToPdf />} />
            <Route path="/word-to-pdf/" element={<WordToPdf />} />
            <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
            <Route path="/pdf-to-jpg/" element={<PdfToJpg />} />
            <Route path="/pdf-to-png" element={<PdfToPng />} />
            <Route path="/pdf-to-png/" element={<PdfToPng />} />
            <Route path="/pdf-to-pptx" element={<PdfToPptx />} />
            <Route path="/pdf-to-pptx/" element={<PdfToPptx />} />
            <Route path="/pptx-to-pdf" element={<PptxToPdf />} />
            <Route path="/pptx-to-pdf/" element={<PptxToPdf />} />
            <Route path="/compress-docx" element={<CompressDocx />} />
            <Route path="/compress-docx/" element={<CompressDocx />} />
            <Route path="/compress-pptx" element={<CompressPptx />} />
            <Route path="/compress-pptx/" element={<CompressPptx />} />

            {/* Utilities */}
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/json-formatter/" element={<JsonFormatter />} />
            <Route path="/image-compressor" element={<ImageCompressor />} />
            <Route path="/image-compressor/" element={<ImageCompressor />} />
            <Route path="/cgpa-calculator" element={<CgpaCalculator />} />
            <Route path="/cgpa-calculator/" element={<CgpaCalculator />} />
            <Route path="/code-formatter" element={<CodeFormatter />} />
            <Route path="/code-formatter/" element={<CodeFormatter />} />

            {/* Content & Legal */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/privacy/" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/terms/" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact/" element={<Contact />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
