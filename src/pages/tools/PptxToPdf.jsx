import { Presentation } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import PptxToPdfTool from '../../components/pdf/PptxToPdfTool';

const faqs = [
  {
    q: "How do I convert PowerPoint to PDF for free?",
    a: "Upload your PowerPoint (.pptx or .ppt) document to PdfNest's PowerPoint to PDF converter. Our tool will securely convert your presentation to a universally accessible PDF format."
  },
  {
    q: "Will my slide formatting be preserved?",
    a: "Yes! Converting PowerPoint to PDF ensures that your slides, fonts, images, and layout look exactly the same on any device without requiring PowerPoint installed."
  },
  {
    q: "Is it safe to convert PowerPoint documents to PDF online?",
    a: "Absolutely. We built PdfNest with privacy in mind. Your confidential presentations are never uploaded to any cloud server."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'PowerPoint to PDF' }
];

export default function PptxToPdf() {
  return (
    <div className="space-y-0">
      <SEO
        title="PowerPoint to PDF Converter Free — Convert PPTX to PDF Online"
        description="Convert PowerPoint presentations (.pptx, .ppt) to PDF for free. Preserve formatting, fonts, and layouts. Fast, secure, browser-based converter."
        canonical="/pptx-to-pdf"
        keywords="powerpoint to pdf, convert pptx to pdf, pptx to pdf, pptx to pdf converter, powerpoint to pdf free, create pdf"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PowerPoint to PDF Converter',
            description: 'Free online tool to convert PowerPoint presentations into PDF files.',
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Presentation className="w-3 h-3" />
              <span>PowerPoint to PDF</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert PowerPoint to PDF
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform PowerPoint presentations into universally readable PDF files with <strong className="text-white">preserved formatting</strong>.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <PptxToPdfTool />
        </div>
      </section>

      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PowerPoint to PDF Online</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PPTX File', desc: 'Click or drag & drop your PowerPoint (.pptx) document into the dropzone.' },
              { step: '2', title: 'Automatic Conversion', desc: 'Our engine will securely convert the file into a fixed-layout PDF.' },
              { step: '3', title: 'Download PDF', desc: 'Instantly download your universally readable PDF document.' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-400/20 text-orange-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="PowerPoint to PDF — Frequently Asked Questions" />
      <RelatedTools currentToolId="pptx-to-pdf" category="PDF Tools" />
    </div>
  );
}
