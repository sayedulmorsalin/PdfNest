import { FileText } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import PdfToWordTool from '../../components/pdf/PdfToWordTool';

const faqs = [
  {
    q: "How do I convert PDF to Word for free?",
    a: "Upload your PDF to PdfNest's PDF to Word converter. Our advanced engine analyzes the document structure to reconstruct text, headings, bold/italic formatting, and bullet points into a fully editable Word (.docx) file. No registration required."
  },
  {
    q: "Is it safe to convert PDFs to Word online?",
    a: "Yes! All processing happens completely inside your web browser using JavaScript. Your confidential business documents, resumes, and personal files are never uploaded to any cloud server. PdfNest is the only major online PDF converter that processes files locally."
  },
  {
    q: "Will my formatting be preserved?",
    a: "Yes. Our client-side parser detects font sizes, weights, and positioning to reconstruct Headings (H1, H2), bullet points, and paragraphs. Bold and italic text is also preserved. Complex multi-column layouts may need minor manual adjustments."
  },
  {
    q: "Can I convert scanned PDFs to Word?",
    a: "Scanned PDFs contain image data rather than embedded text. PdfNest works best with digital PDFs (where you can highlight text). Scanned documents require OCR technology — for those, Google Docs or Adobe Acrobat Online offer free basic OCR."
  },
  {
    q: "What is the maximum file size I can convert?",
    a: "Since all processing happens in your browser, the limit depends on your device's available memory. Most modern devices handle PDFs up to 100MB without issues. For very large documents, splitting the PDF first may improve performance."
  },
  {
    q: "Why does my converted Word document look different?",
    a: "PDF and DOCX are fundamentally different formats. PDFs store fixed page layouts; Word uses flowing text. During conversion, some spacing, font, or layout differences may appear — especially for PDFs with complex designs like multi-column text, overlapping elements, or decorative borders."
  },
  {
    q: "Can I convert multiple PDFs to Word at once?",
    a: "Currently, PdfNest converts one file at a time for best accuracy. Since there's no upload wait time, you can convert files back-to-back very quickly."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'PDF to Word' }
];

export default function PdfToWord() {
  return (
    <div className="space-y-0">
      <SEO
        title="PDF to Word Converter Free — Convert PDF to DOCX Online"
        description="Convert PDF files to editable Word documents (.docx) with preserved formatting, headings, and bullet points. 100% browser-based — your files never leave your device. No watermarks, no registration."
        canonical="/pdf-to-word"
        keywords="pdf to word, convert pdf to word, pdf to docx, pdf to word converter, pdf to word free, edit pdf online, pdf to word without adobe, free pdf to word, convert pdf to docx online"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF to Word Converter',
            description: 'Free online tool to convert PDF documents into editable Word (.docx) files with preserved formatting.',
            category: 'UtilityApplication',
            features: [
              'Formatting preservation',
              'Heading detection (H1, H2)',
              'Bold and italic text support',
              'Bullet point reconstruction',
              'Browser-based processing',
              'No watermarks',
              'Free unlimited use'
            ]
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <FileText className="w-3 h-3" />
              <span>PDF to Word</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert PDF to Word — Free DOCX Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform PDFs into fully editable Word (.docx) documents with{' '}
              <strong className="text-white">preserved formatting, headings, and bullet points</strong>.{' '}
              100% browser-based — your files never leave your device.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <PdfToWordTool />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PDF to Word Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Converting a PDF to an editable Word document used to require expensive desktop software like Adobe Acrobat.
            PdfNest makes it completely free, instant, and private — no uploads, no accounts, no waiting.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click the upload area or drag & drop your PDF file. Digital PDFs (with selectable text) convert best.' },
              { step: '2', title: 'Smart Conversion', desc: 'Our engine detects font sizes, bold/italic text, headings, and bullet points to reconstruct your document structure.' },
              { step: '3', title: 'Download DOCX', desc: 'Instantly download your fully editable Word document. Open it in Microsoft Word, Google Docs, or LibreOffice.' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Convert PDF to Word?</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">✏️ Edit Received Documents</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PDFs are designed to be read-only. When you receive a contract, report, or form as a PDF that needs
            changes, converting to Word is the easiest way to make edits without retyping the entire document.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📋 Extract and Reuse Content</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Need to pull a table, chart description, or section of text from a PDF into a new document? Converting
            to Word gives you properly formatted, editable content that you can copy, paste, and rework freely.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🔄 Update Old Documents</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Many organizations have years of PDF documents — old reports, policies, templates — that were created
            before the originals were lost. Converting them to Word brings them back to life as editable files.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📝 Collaborate and Track Changes</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Word documents support tracked changes and comments — essential for team collaboration and document
            review workflows. Convert your PDF to Word first, then use Word's review tools to mark changes.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">How Our PDF to Word Conversion Works</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Unlike basic converters that dump raw text into a Word file, PdfNest's engine analyzes the <strong className="text-white">geometric
            position and visual properties</strong> of every text element in the PDF:
          </p>
          <ul className="text-muted-foreground leading-relaxed mb-6 space-y-2 list-disc list-inside">
            <li><strong className="text-white">Font size analysis</strong> — Large text becomes Heading 1 or Heading 2; normal text becomes body paragraphs</li>
            <li><strong className="text-white">Font weight detection</strong> — Bold text is marked as bold in Word; italic text preserves italic styling</li>
            <li><strong className="text-white">Bullet point detection</strong> — Indented lists and bullet symbols are converted to proper Word list items</li>
            <li><strong className="text-white">Paragraph spacing</strong> — Vertical gaps between text blocks are preserved as paragraph breaks</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The result is a Word document that looks like your PDF — not a wall of unstyled text.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's PDF to Word Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🔒 100% Private', description: 'Files never leave your device. Zero server uploads. Your documents are never seen by anyone but you.' },
              { title: '📐 Smart Formatting', description: 'Detects headings, bullet points, bold/italic text — not just raw paragraph dumps.' },
              { title: '⚡ Instant Results', description: 'No upload delays. Conversion runs directly in your browser using your device\'s processing power.' },
              { title: '🆓 Truly Free', description: 'No subscriptions, no watermarks, no daily limits. Unlimited PDF to Word conversions forever.' },
              { title: '📱 Any Device', description: 'Works on phones, tablets, laptops, and desktops. Any modern browser, any operating system.' },
              { title: '📄 DOCX Output', description: 'Outputs the modern .docx format, compatible with Microsoft Word, Google Docs, and LibreOffice.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="PDF to Word — Frequently Asked Questions" />
      <RelatedTools currentToolId="pdf-to-word" category="PDF Tools" />
    </div>
  );
}
