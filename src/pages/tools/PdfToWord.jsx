import { FileText } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import PdfToWordTool from '../../components/pdf/PdfToWordTool';

const faqs = [
  {
    q: "How do I convert PDF to Word for free?",
    a: "Upload your PDF to PdfNest's PDF to Word converter. Our advanced engine analyzes the document to reconstruct text, headings, and formatting into an editable Word (.docx) document."
  },
  {
    q: "Is it safe to convert PDFs to Word online?",
    a: "Yes! All processing happens completely inside your web browser. Your confidential business documents, resumes, and personal files are never uploaded to any cloud server."
  },
  {
    q: "Will my formatting be preserved?",
    a: "Yes. Our client-side parser detects font sizes, weights, and positioning to reconstruct Headings (H1, H2), bullet points, and paragraphs rather than just dumping raw text."
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
        description="Convert PDF files to editable Word documents with preserved formatting. Fast, secure, browser-based converter. No watermarks, no registration required."
        canonical="/pdf-to-word"
        keywords="pdf to word, convert pdf to word, pdf to docx, pdf to word converter, pdf to word free, edit pdf online"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF to Word Converter',
            description: 'Free online tool to convert PDF documents into editable Word files.',
            category: 'UtilityApplication',
            features: ['Formatting preservation', 'Browser-based processing', 'Free unlimited use']
          }),
          buildFAQSchema(faqs),
          buildBreadcrumbSchema(breadcrumbs),
        ]}
      />

      <section className="px-4 py-12 md:py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <FileText className="w-3 h-3" />
              <span>PDF to Word</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert PDF to Word
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform PDFs into editable Word (.docx) documents with <strong className="text-white">preserved formatting</strong>. 
              100% browser-based — no uploads.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <PdfToWordTool />
        </div>
      </section>

      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PDF to Word Online</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click or drag & drop your PDF file into the dropzone above.' },
              { step: '2', title: 'Smart Conversion', desc: 'Our engine detects paragraphs, headings, and formatting to reconstruct your document.' },
              { step: '3', title: 'Download DOCX', desc: 'Instantly download your fully editable Word document.' },
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
        </div>
      </section>

      <FAQSection faqs={faqs} title="PDF to Word — Frequently Asked Questions" />
      <RelatedTools currentToolId="pdf-to-word" category="PDF Tools" />
    </div>
  );
}
