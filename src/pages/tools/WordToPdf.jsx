import { FileUp } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import WordToPdfTool from '../../components/pdf/WordToPdfTool';

const faqs = [
  {
    q: "How do I convert Word to PDF for free?",
    a: "Upload your Word (.docx or .doc) document to PdfNest's Word to PDF converter. Our tool will securely convert your file to a universally accessible PDF format."
  },
  {
    q: "Will my formatting be preserved?",
    a: "Yes! Converting Word to PDF ensures that your fonts, images, and layout look exactly the same on any device."
  },
  {
    q: "Is it safe to convert Word documents to PDF online?",
    a: "Absolutely. We built PdfNest with privacy in mind. Your confidential documents are never uploaded to any cloud server."
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
        description="Convert Word documents (.docx, .doc) to PDF for free. Preserve formatting, fonts, and layouts. Fast, secure, browser-based converter."
        canonical="/word-to-pdf"
        keywords="word to pdf, convert word to pdf, docx to pdf, word to pdf converter, word to pdf free, create pdf"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest Word to PDF Converter',
            description: 'Free online tool to convert Word documents into PDF files.',
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
              <FileUp className="w-3 h-3" />
              <span>Word to PDF</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert Word to PDF
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform Word documents into universally readable PDF files with <strong className="text-white">preserved formatting</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <WordToPdfTool />
        </div>
      </section>

      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert Word to PDF Online</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your Word File', desc: 'Click or drag & drop your Word (.docx) document into the dropzone.' },
              { step: '2', title: 'Automatic Conversion', desc: 'Our engine will securely convert the file into a fixed-layout PDF.' },
              { step: '3', title: 'Download PDF', desc: 'Instantly download your universally readable PDF document.' },
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

      <FAQSection faqs={faqs} title="Word to PDF — Frequently Asked Questions" />
      <RelatedTools currentToolId="word-to-pdf" category="PDF Tools" />
    </div>
  );
}
