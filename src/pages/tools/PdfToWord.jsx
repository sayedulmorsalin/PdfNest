import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';

const faqs = [
  {
    q: "How do I convert a PDF to Word for free?",
    a: "Upload your PDF to PdfNest's PDF to Word converter, and it will automatically extract the text with preserved formatting — headings, bold text, bullet points, and paragraph structure. The converted .docx file downloads instantly. No registration required."
  },
  {
    q: "Will the formatting be preserved when converting PDF to Word?",
    a: "Yes! PdfNest uses smart structure analysis to detect headings, body text, bullet points, bold/italic formatting, and paragraph spacing. The resulting Word document closely matches the original PDF layout. Complex layouts with multiple columns or heavy graphics may require minor adjustments."
  },
  {
    q: "Can I convert scanned PDFs to Word?",
    a: "Currently, PdfNest's converter works best with text-based PDFs (digitally created documents). Scanned PDFs (images of text) require OCR (Optical Character Recognition), which is a feature we're actively developing."
  },
  {
    q: "Is it safe to convert PDF to Word online?",
    a: "Absolutely. PdfNest processes everything locally in your browser. Your PDF file is never uploaded to any server. This makes it the safest option for converting confidential documents like contracts, legal papers, or financial reports."
  },
  {
    q: "Do I need Adobe Acrobat to convert PDF to Word?",
    a: "No! PdfNest is a completely free alternative to Adobe Acrobat. You don't need any software installation — just open PdfNest in your browser, upload your PDF, and download the Word file. It works on any device with a modern web browser."
  },
  {
    q: "What Word format does the converter produce?",
    a: "PdfNest creates .docx files, which is the standard format compatible with Microsoft Word 2007 and later, Google Docs, LibreOffice Writer, and Apple Pages."
  },
  {
    q: "Can I convert multiple PDFs to Word at once?",
    a: "Currently, the converter handles one file at a time for optimal formatting accuracy. You can convert files back-to-back instantly since processing is local and there's no upload delay."
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
        description="Convert PDF to Word (DOCX) for free with preserved formatting. No watermarks, no registration, no Adobe needed. Fast, secure, browser-based PDF to Word converter."
        canonical="/pdf-to-word"
        keywords="pdf to word, pdf to docx, convert pdf to word, pdf to word converter, pdf to word free, pdf to word online, convert pdf to docx, free pdf converter, pdf to word without adobe"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF to Word Converter',
            description: 'Free online tool to convert PDF documents to editable Word (DOCX) files with preserved formatting.',
            category: 'UtilityApplication',
            features: ['Preserves headings and formatting', 'Detects bold, italic, and bullets', 'No Adobe required', 'Browser-based processing', 'Free unlimited use']
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
              Convert PDF to Word — Free & No Adobe Needed
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your PDF files into editable Word documents with <strong className="text-white">preserved formatting</strong>. 
              Headings, bullet points, bold text — all kept intact. 100% free and private.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 transition-colors">
            <FileText className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Convert PDF to Word</h3>
            <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
              Upload your PDF and get an editable Word document with formatting preserved.
            </p>
            <Link
              to="/pdf-editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Open PDF Converter <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PDF to Word Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Need to edit a PDF document? Converting it to Word (.docx) format is the easiest way. PdfNest's converter 
            uses advanced text analysis to recreate your document's structure in Word format. Here's how:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click or drag & drop your PDF file. Any text-based PDF works.' },
              { step: '2', title: 'Click "PDF → Word"', desc: 'Select the Word conversion option. The tool analyzes headings, formatting, and structure.' },
              { step: '3', title: 'Download Your DOCX', desc: 'Your converted Word document downloads automatically with formatting preserved.' },
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

          <h3 className="text-xl font-semibold mb-3 text-white">✏️ Edit Content Easily</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PDFs are designed to be read, not edited. When you need to modify text, update numbers, fix typos, or 
            reorganize content, converting to Word gives you full editing capability. Change fonts, add paragraphs, 
            insert images, and reformat to your heart's content.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📋 Reuse Content</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Instead of retyping entire documents, convert them to Word and copy/paste the content you need. This is 
            invaluable for repurposing reports, extracting quotes from research papers, or updating templates that 
            were originally saved as PDFs.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🤝 Collaborate with Teams</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Word documents support track changes, comments, and real-time collaboration (via Google Docs or Microsoft 365). 
            Converting a PDF to Word enables your team to review and contribute to the document together.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📊 Extract Data</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Need to pull data from a PDF report into a spreadsheet? Converting to Word first makes it much easier to 
            select, copy, and paste structured data like tables, lists, and financial figures.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">PdfNest vs. Adobe Acrobat</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-white font-semibold">Feature</th>
                  <th className="px-4 py-3 text-white font-semibold">PdfNest</th>
                  <th className="px-4 py-3 text-white font-semibold">Adobe Acrobat</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-white/5"><td className="px-4 py-3">Price</td><td className="px-4 py-3 text-emerald-400">Free</td><td className="px-4 py-3">$19.99/month</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Privacy</td><td className="px-4 py-3 text-emerald-400">100% Local</td><td className="px-4 py-3">Cloud-based</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Registration</td><td className="px-4 py-3 text-emerald-400">None required</td><td className="px-4 py-3">Account required</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Installation</td><td className="px-4 py-3 text-emerald-400">Browser-based</td><td className="px-4 py-3">Software download</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Formatting</td><td className="px-4 py-3">Good</td><td className="px-4 py-3">Excellent</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">What Our Converter Preserves</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '📑 Headings', description: 'H1, H2, H3 headings are detected by font size and weight analysis.' },
              { title: '🔤 Text Formatting', description: 'Bold, italic, and font styles are preserved in the Word output.' },
              { title: '📝 Bullet Points', description: 'Both numbered and bulleted lists are detected and formatted properly.' },
              { title: '↔️ Paragraphs', description: 'Paragraph spacing and text alignment are maintained accurately.' },
              { title: '📄 Page Breaks', description: 'Multi-page documents retain their page break structure.' },
              { title: '🔒 Privacy First', description: 'Zero server uploads. Your files never leave your device.' },
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
