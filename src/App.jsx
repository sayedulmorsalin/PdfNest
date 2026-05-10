import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import JsonFormatter from './pages/JsonFormatter';
import ImageCompressor from './pages/ImageCompressor';
import CgpaCalculator from './pages/CgpaCalculator';
import CodeFormatter from './pages/CodeFormatter';
import PdfEditor from './pages/PdfEditor';

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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
