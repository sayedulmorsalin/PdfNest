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
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
