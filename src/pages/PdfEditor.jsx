import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Download, Zap, Merge, Scissors, FileDown, CheckCircle, AlertCircle, Loader, X, FileText, Image } from 'lucide-react';
import SEO, { buildFAQSchema } from '../components/SEO';
import FAQSection from '../components/FAQSection';
import RelatedTools from '../components/RelatedTools';

import MergeTool from '../components/pdf/MergeTool';
import SplitTool from '../components/pdf/SplitTool';
import CompressTool from '../components/pdf/CompressTool';
const faqs = [
  {
    q: "Is this PDF Editor completely free?",
    a: "Yes! PdfNest offers a 100% free PDF editor. There are no daily limits, no watermarks added to your documents, and you don't even need to create an account to use our tools."
  },
  {
    q: "How does the PDF to Word converter preserve formatting?",
    a: "Our advanced client-side PDF parser analyzes the geometric position, font size, and weight of every text element in the PDF. It uses this data to reconstruct headings, bullet points, and paragraphs in the output Word (.docx) document, rather than just dumping raw text."
  },
  {
    q: "Are my sensitive PDF documents secure?",
    a: "Absolutely. We built PdfNest with a privacy-first architecture. All PDF processing (conversion, formatting analysis, splitting, merging) happens entirely inside your web browser. Your confidential business documents, resumes, and personal files are never uploaded to any cloud server."
  },
  {
    q: "Can I use this on my mobile phone?",
    a: "Yes, our PDF tools are fully responsive and work on iOS and Android devices directly through your mobile web browser."
  },
  {
    q: "Why do some scanned PDFs not convert to text?",
    a: "If a PDF was created by scanning a physical piece of paper, it is essentially an image wrapped in a PDF file. Currently, our tool requires 'searchable' PDFs (PDFs where you can highlight the text). OCR (Optical Character Recognition) support for scanned documents is coming in a future update."
  }
];
import * as pdfjsLib from 'pdfjs-dist';
import { convertPdfToPptx, triggerDownload } from '../utils/pdfConverter';

// ─── React Component ───────────────────────────────────────────────────────────

export default function PdfEditor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'converter');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [status, setStatus] = useState({ type: null, message: '' }); // null | 'loading' | 'success' | 'error'
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', icon: null });

  useEffect(() => {
    if (tabParam && ['converter', 'merger', 'splitter', 'compressor'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    setStatus({ type: null, message: '' });
  };

  const tabs = [
    { id: 'converter', name: 'PDF Converter', icon: Zap },
    { id: 'merger', name: 'PDF Merger', icon: Merge },
    { id: 'splitter', name: 'PDF Splitter', icon: Scissors },
    { id: 'compressor', name: 'PDF Compressor', icon: FileDown },
  ];

  const showAlert = (title, message, icon) => {
    setAlertModal({ isOpen: true, title, message, icon });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  const AlertModal = () => (
    <AnimatePresence>
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlert}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button onClick={closeAlert} className="p-1 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {alertModal.icon ? <alertModal.icon className="w-8 h-8 text-primary" /> : <Zap className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{alertModal.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {alertModal.message}
              </p>
              <button
                onClick={closeAlert}
                className="mt-8 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const handleFileUpload = (e) => setSelectedFiles(Array.from(e.target.files));

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
    if (files.length) setSelectedFiles(files);
  };

  const handleConvert = async (format) => {
    if (!selectedFiles.length) {
      setStatus({ type: 'error', message: 'Please select a PDF file first.' });
      return;
    }
    const file = selectedFiles[0];
    setStatus({ type: 'loading', message: 'Starting conversion…' });

    try {
      if (format === 'PPTX') {
        await convertPdfToPptx(file, msg => setStatus({ type: 'loading', message: msg }));
        setStatus({ type: 'success', message: '✅ PowerPoint downloaded successfully!' });
      } else if (format === 'PNG' || format === 'JPG') {
        setStatus({ type: 'loading', message: `Converting pages to ${format}...` });
        
        // Configure PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          setStatus({
            type: 'loading',
            message: `Rendering page ${pageNum} of ${numPages} to ${format}...`
          });
          
          const page = await pdf.getPage(pageNum);
          const scale = 2.0; // Render at 2x scale for higher quality images
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
          
          const mimeType = format === 'PNG' ? 'image/png' : 'image/jpeg';
          const fileExt = format === 'PNG' ? 'png' : 'jpg';
          const dataUrl = canvas.toDataURL(mimeType, 0.92);
          const base64Data = dataUrl.split(',')[1];
          zip.file(`page_${pageNum}.${fileExt}`, base64Data, { base64: true });
        }
        
        setStatus({ type: 'loading', message: 'Creating ZIP file...' });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        triggerDownload(zipBlob, `${file.name.replace(/\.pdf$/i, '')}_images.zip`);
        setStatus({ type: 'success', message: `✅ Successfully converted PDF to ${format} ZIP!` });
      } else {
        setStatus({ type: 'error', message: `${format} conversion coming soon!` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: `❌ Error: ${err.message}` });
      console.error(err);
    }
  };

  const converterOptions = [
    { format: 'PPTX', label: 'PDF → PowerPoint', description: 'Smart slide layout from PDF structure', icon: '📊' },
    { format: 'PNG', label: 'PDF → PNG', description: 'High-quality lossless images inside ZIP', icon: '🖼️' },
    { format: 'JPG', label: 'PDF → JPG', description: 'Compressed JPEG images inside ZIP', icon: '🗜️' },
  ];

  const StatusBar = () => {
    if (!status.type) return null;
    const colors = {
      loading: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      success: 'bg-green-500/10 border-green-500/30 text-green-300',
      error: 'bg-red-500/10 border-red-500/30 text-red-300',
    };
    return (
      <div className={`flex items-center gap-3 p-4 rounded-lg border text-sm ${colors[status.type]}`}>
        {status.type === 'loading' && <Loader className="w-4 h-4 animate-spin shrink-0" />}
        {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
        {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
        <span>{status.message}</span>
      </div>
    );
  };

  const renderConverterTab = () => (
    <div className="space-y-6">
      <StatusBar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {converterOptions.map((opt) => (
          <div
            key={opt.format}
            onClick={() => handleConvert(opt.format)}
            className="p-6 border border-white/10 rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{opt.icon}</span>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                  {opt.label}
                </h3>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
              <Download className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-200 space-y-1">
        <p className="font-semibold">💡 How it works</p>
        <ul className="list-disc list-inside text-xs space-y-1 text-amber-200/80">
          <li>Analyses font sizes to detect headings vs body text</li>
          <li>Detects bold, italic, bullet points and indentation</li>
          <li>Reconstructs Word styles: Heading 1, Heading 2, bullet lists</li>
          <li>Preserves paragraph spacing and text alignment</li>
        </ul>
      </div>
    </div>
  );

  const tabComponents = {
    converter: renderConverterTab,
    merger: () => <MergeTool />,
    splitter: () => <SplitTool />,
    compressor: () => <CompressTool />
  };

  return (
    <>
      <SEO
        title="Professional PDF Editor - Convert PDF to Word, Merge & Split"
        description="Free online PDF editor to convert PDF to Word with preserved formatting, PDF to PowerPoint, merge, split, and compress PDFs. 100% browser-based for maximum security."
        canonical="/pdf-editor"
        keywords="PDF to Word, free PDF editor, merge PDF, split PDF, compress PDF, PDF to PPTX, browser-based PDF editor, edit PDF online, convert PDF to Docx"
        schemas={[{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PdfNest PDF Editor",
          "operatingSystem": "Web",
          "applicationCategory": "OfficeApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Convert PDF to Word (Docx)",
            "Convert PDF to PowerPoint (PPTX)",
            "Merge PDF files",
            "Split PDF pages",
            "Compress PDF size"
          ],
          "screenshot": "https://pdfnest.shop/screenshots/pdf-editor.png"
        },
        buildFAQSchema(faqs)
      ]}
    />
      <div className="min-h-screen">
        {/* Hero */}
        <section className="px-4 py-12 md:py-20 border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium text-primary">PDF TOOLS</p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              All-in-One PDF Editor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert PDFs with <strong className="text-white">preserved formatting</strong> — headings, bullets, bold text and paragraph structure are kept intact. 100% browser-based, no uploads.
            </p>
          </div>
        </section>

        {/* Upload */}
        {activeTab === 'converter' && (
          <section className="px-4 py-8 border-b border-white/5">
            <div className="max-w-4xl mx-auto">
              <label
                className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary/50 transition-colors group"
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <FileUp className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                <span className="text-lg font-semibold text-white mb-1">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Click or drag & drop PDF here'}
                </span>
                <span className="text-sm text-muted-foreground">Supports single or multiple PDF files</span>
                <input type="file" multiple accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                      <span className="text-sm text-white">📄 {file.name}</span>
                      <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tabs */}
        <section className="px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-primary/10 border border-primary/50 text-primary'
                        : 'text-muted-foreground hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
            <div className="space-y-6">{tabComponents[activeTab]()}</div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="px-4 py-16 border-t border-white/5 mt-12">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <h2 className="text-3xl font-bold text-white mb-6">The Ultimate Free Online PDF Editor</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Managing PDF documents shouldn't require expensive software subscriptions or clunky desktop applications. 
              Welcome to the PdfNest <strong>Online PDF Editor</strong> hub. This suite of tools is designed to handle all your daily document needs—from converting PDFs to editable Word documents, to merging reports, to compressing file sizes for email attachments.
            </p>

            <h3 className="text-2xl font-bold text-white mb-4">A Privacy-First Approach to PDF Editing</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When you use traditional online PDF converters, you are forced to upload your files to an external server. This is a massive security risk if you are working with tax returns, legal contracts, or confidential business data. 
              <strong>PdfNest is different.</strong> Our tools utilize cutting-edge client-side WebAssembly and JavaScript technologies. This means that when you convert or edit a PDF, the processing power of your own device is used. <strong>Your files never leave your computer or mobile phone.</strong>
            </p>

            <h3 className="text-2xl font-bold text-white mb-4">Core PDF Features</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass p-6 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" /> PDF to Word (Docx)
                </h4>
                <p className="text-sm text-muted-foreground">Unlike basic converters that ruin your layout, our smart parser detects font sizes to reconstruct Headings (H1, H2), Bullet points, and bold text, ensuring your downloaded Word document looks exactly like the original PDF.</p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" /> PDF to PowerPoint
                </h4>
                <p className="text-sm text-muted-foreground">Instantly transform lengthy PDF reports into ready-to-present PowerPoint (.pptx) slides. Our engine automatically paginates content and formats headers for slide titles.</p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Merge className="w-5 h-5 text-green-400" /> Merge & Split
                </h4>
                <p className="text-sm text-muted-foreground">Combine multiple PDF documents into a single cohesive file, or extract specific pages from a massive document to create a smaller, targeted PDF.</p>
              </div>
              <div className="glass p-6 rounded-2xl border border-white/5">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <FileDown className="w-5 h-5 text-purple-400" /> Compress PDF
                </h4>
                <p className="text-sm text-muted-foreground">Struggling with a 50MB PDF that won't attach to an email? Our compressor reduces PDF file sizes significantly while maintaining crisp text and image quality.</p>
              </div>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} title="PDF Editor — Frequently Asked Questions" />
        
        <div className="max-w-4xl mx-auto pt-8 pb-12">
          <RelatedTools currentToolId="pdf-editor" category="PDF Tools" />
        </div>
      </div>
      <AlertModal />
    </>
  );
}
