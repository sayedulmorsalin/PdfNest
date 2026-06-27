import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import ImageCompressor from './pages/ImageCompressor';
import CgpaCalculator from './pages/CgpaCalculator';
import CodeFormatter from './pages/CodeFormatter';
import PdfEditor from './pages/PdfEditor';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

import MergePdf from './pages/tools/MergePdf';
import CompressPdf from './pages/tools/CompressPdf';
import SplitPdf from './pages/tools/SplitPdf';
import PdfToJpg from './pages/tools/PdfToJpg';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/cgpa-calculator" element={<CgpaCalculator />} />
          <Route path="/code-formatter" element={<CodeFormatter />} />
          <Route path="/pdf-editor" element={<PdfEditor />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/compress-pdf" element={<CompressPdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
