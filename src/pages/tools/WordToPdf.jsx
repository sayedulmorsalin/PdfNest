import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';

const faqs = [
  {
    q: "How do I convert a Word document to PDF for free?",
    a: "Upload your Word file (.doc or .docx) to PdfNest's Word to PDF converter, and it will create a PDF that preserves all your formatting, fonts, and layout. The PDF downloads instantly — no registration needed."
  },
  {
    q: "Will my formatting be preserved?",
    a: "Yes. PdfNest's converter maintains your document's fonts, headings, images, tables, page margins, and layout. The resulting PDF looks identical to what you see in Microsoft Word."
  },
  {
    q: "Can I convert Word to PDF on my phone?",
    a: "Absolutely! PdfNest works on any device with a modern web browser — smartphones, tablets, laptops, and desktops. No app installation needed."
  },
  {
    q: "Is Word to PDF conversion secure?",
    a: "Yes, completely. PdfNest processes everything locally in your browser. Your Word file is never sent to any server, making it safe for confidential business documents."
  },
  {
    q: "Why should I convert Word to PDF?",
    a: "PDFs are the universal standard for sharing documents. They look the same on every device, can't be accidentally edited, and are accepted by virtually all organizations for official submissions."
  },
  {
    q: "Do I need Microsoft Word installed?",
    a: "No. PdfNest's converter works independently of Microsoft Office. You just need a web browser — the tool handles the conversion entirely on its own."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'Word to PDF' }
];

export default function WordToPdf() {
  return (
    <div className="space-y-0">
      <SEO
        title="Word to PDF Converter Free — Convert DOCX to PDF Online"
        description="Convert Word documents (DOC, DOCX) to PDF for free. Preserve all formatting, fonts, and layout. No watermarks, no registration. Fast, secure, browser-based converter."
        canonical="/word-to-pdf"
        keywords="word to pdf, docx to pdf, convert word to pdf, word to pdf converter, word to pdf free, doc to pdf, convert docx to pdf online, word to pdf online"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest Word to PDF Converter',
            description: 'Free online tool to convert Word documents (DOC, DOCX) to PDF format with preserved formatting.',
            category: 'UtilityApplication',
            features: ['Preserves formatting', 'Supports DOC and DOCX', 'No software required', 'Browser-based', 'Free unlimited use']
          }),
          buildFAQSchema(faqs),
          buildBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Hero */}
      <section className="px-4 py-12 md:py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/10 border border-indigo-400/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <FileText className="w-3 h-3" />
              <span>Word to PDF</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert Word to PDF — Free Online Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your Word documents into professional PDF files instantly. 
              <strong className="text-white"> All formatting preserved</strong> — fonts, images, tables, and layout stay perfect.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 transition-colors">
            <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Convert Word to PDF</h3>
            <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
              Upload your Word document and download it as a perfectly formatted PDF.
            </p>
            <Link
              to="/pdf-editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Open PDF Editor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert Word to PDF Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Converting Word documents to PDF is essential for sharing professional documents. PDFs maintain 
            consistent formatting across all devices and operating systems, making them the gold standard 
            for business, academic, and legal documents.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Word File', desc: 'Click to upload or drag & drop your .doc or .docx file.' },
              { step: '2', title: 'Convert Instantly', desc: 'The tool processes your document and creates a PDF with matching formatting.' },
              { step: '3', title: 'Download PDF', desc: 'Your converted PDF downloads automatically. Ready to share or print.' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-400/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">When to Use Word to PDF Conversion</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-white">📄 Professional Document Sharing</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you send a Word document, the recipient's computer might display it differently depending on their 
            installed fonts, Word version, or operating system. Converting to PDF ensures everyone sees exactly the 
            same document — pixel perfect, every time.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📋 Official Submissions</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Government agencies, universities, and many organizations require PDF format for submissions. Whether 
            it's a job application, thesis, tax form, or legal filing, Word to PDF conversion is often the final step 
            before submission.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🔒 Document Protection</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PDFs are harder to accidentally edit than Word documents. When you share a contract, invoice, or 
            important report, converting to PDF prevents unintentional changes by the recipient.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🖨️ Print-Ready Output</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PDFs are designed for print. Page margins, font rendering, and image quality are preserved exactly 
            as you intended. What you see on screen is exactly what will come out of the printer.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Supported File Formats</h2>
          <ul className="text-muted-foreground space-y-2 mb-6 list-disc list-inside">
            <li><strong className="text-white">.docx</strong> — Microsoft Word 2007 and later (recommended)</li>
            <li><strong className="text-white">.doc</strong> — Legacy Microsoft Word format</li>
            <li><strong className="text-white">Google Docs</strong> — Download as .docx first, then convert</li>
            <li><strong className="text-white">LibreOffice Writer</strong> — Save as .docx, then convert</li>
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Convert with PdfNest?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🎯 Perfect Formatting', description: 'Fonts, images, tables, and margins are preserved exactly.' },
              { title: '🔒 100% Private', description: 'Your documents never leave your device. Zero server uploads.' },
              { title: '⚡ Instant Conversion', description: 'No queue, no waiting. Your PDF is ready in seconds.' },
              { title: '📱 Any Device', description: 'Works on Windows, Mac, Linux, Android, and iOS.' },
              { title: '🆓 Always Free', description: 'No subscriptions, no trials, no watermarks. Free forever.' },
              { title: '🚫 No Installation', description: 'No software download needed. Everything runs in your browser.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Word to PDF — Frequently Asked Questions" />
      <RelatedTools currentToolId="word-to-pdf" category="PDF Tools" />
    </div>
  );
}
