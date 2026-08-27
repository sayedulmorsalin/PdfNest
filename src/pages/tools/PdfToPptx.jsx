import { Presentation } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import PdfToPptxTool from '../../components/pdf/PdfToPptxTool';

const faqs = [
  {
    q: "How do I convert PDF to PowerPoint for free?",
    a: "Upload your PDF to PdfNest's PDF to PPTX converter. Our tool will analyze the document and automatically reconstruct slide layouts, generating a fully editable PowerPoint presentation. No registration required."
  },
  {
    q: "Is it safe to convert PDFs to PPTX online?",
    a: "Yes. All processing is done locally in your browser. Your PDF is never uploaded to any server, ensuring complete privacy."
  },
  {
    q: "Will the formatting be preserved?",
    a: "Our advanced client-side parser attempts to reconstruct the slide structure as closely as possible, maintaining headings, text layout, and general formatting."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'PDF to PPTX' }
];

export default function PdfToPptx() {
  return (
    <div className="space-y-0">
      <SEO
        title="PDF to PowerPoint Converter Free — Convert PDF to PPTX Online"
        description="Convert PDF files to editable PowerPoint presentations. Fast, secure, browser-based converter. No watermarks, no registration required."
        canonical="/pdf-to-pptx"
        keywords="pdf to pptx, pdf to powerpoint, convert pdf to pptx, pdf to pptx converter, pdf to powerpoint free"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF to PPTX Converter',
            description: 'Free online tool to convert PDF documents into editable PowerPoint slides.',
            category: 'UtilityApplication',
            features: ['Layout preservation', 'Browser-based processing', 'Free unlimited use']
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
              <span>PDF to PPTX</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert PDF to PowerPoint
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instantly transform lengthy PDF reports into ready-to-present PowerPoint (.pptx) slides.
              <strong className="text-white">100% browser-based</strong> — completely private.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <PdfToPptxTool />
        </div>
      </section>

      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PDF to PowerPoint Online</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click or drag & drop your PDF file into the upload zone.' },
              { step: '2', title: 'Automatic Conversion', desc: 'Our tool automatically analyzes your document and paginates it into slides.' },
              { step: '3', title: 'Download PPTX', desc: 'Download your editable PowerPoint presentation instantly.' },
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

      <FAQSection faqs={faqs} title="PDF to PowerPoint — Frequently Asked Questions" />
      <RelatedTools currentToolId="pdf-to-pptx" category="PDF Tools" />
    </div>
  );
}
