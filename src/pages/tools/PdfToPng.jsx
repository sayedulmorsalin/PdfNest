import { FileImage } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import PdfToJpgTool from '../../components/pdf/PdfToJpgTool';

const faqs = [
  {
    q: "How do I convert PDF to PNG for free?",
    a: "Upload your PDF to PdfNest's PDF to PNG converter. Each page of your PDF will be converted into a separate PNG image. You can download individual images or all pages at once. No registration required."
  },
  {
    q: "What resolution are the converted images?",
    a: "PdfNest converts PDF pages to high-resolution PNG images. The output quality is lossless, preserving text crispness and graphics perfectly, suitable for both screen viewing and printing."
  },
  {
    q: "What's the difference between PDF to JPG and PDF to PNG?",
    a: "PNG uses lossless compression, producing larger files with perfect quality ideal for text-heavy documents, diagrams, and screenshots. JPG uses lossy compression, producing smaller files ideal for photographs."
  },
  {
    q: "Is it safe to convert PDFs to images online?",
    a: "With PdfNest, yes. All processing happens locally in your browser. Your PDF is never uploaded to any server, ensuring complete privacy for sensitive documents."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'PDF to PNG' }
];

export default function PdfToPng() {
  return (
    <div className="space-y-0">
      <SEO
        title="PDF to PNG Converter Free — Convert PDF to Images Online"
        description="Convert PDF pages to lossless PNG images for free. High-quality PDF to image conversion. No watermarks, no registration. Fast, secure, browser-based converter."
        canonical="/pdf-to-png"
        keywords="pdf to png, pdf to image, convert pdf to png, pdf to png converter, pdf to image converter, pdf to png free, convert pdf to image online"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF to PNG Converter',
            description: 'Free online tool to convert PDF pages to high-quality PNG images.',
            category: 'UtilityApplication',
            features: ['Lossless output', 'Multi-page support', 'Batch download', 'Browser-based processing', 'Free unlimited use']
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <FileImage className="w-3 h-3" />
              <span>PDF to PNG</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert PDF to PNG — Free Image Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform PDF pages into lossless high-quality PNG images instantly. Perfect for documents, 
              charts, and sharp graphics. <strong className="text-white">100% browser-based</strong> — completely private.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <PdfToJpgTool defaultFormat="png" />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PDF to PNG Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Converting PDF pages to images opens up many possibilities. PdfNest makes the conversion fast and simple:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click or drag & drop your PDF file. Multi-page documents are fully supported.' },
              { step: '2', title: 'Convert Pages', desc: 'Each page is rendered as a lossless PNG image using advanced rendering.' },
              { step: '3', title: 'Download Images', desc: 'Download individual page images or all pages at once as a zip file.' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-teal-400/20 text-teal-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Convert PDF to PNG?</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">📈 Charts & Diagrams</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PNG is a lossless format, making it ideal for images that contain text, line art, and sharp graphics. Converting a PDF with charts into PNG ensures everything stays crisp and readable.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🌐 Website Assets</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you need to display a high-quality document preview on your website without any compression artifacts, PNG is the format to choose over JPG.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's PDF to PNG Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🎯 Lossless Quality', description: 'Output images retain full quality without compression artifacts.' },
              { title: '🔒 100% Private', description: 'Files never leave your device. Complete browser-based processing.' },
              { title: '⚡ Instant Conversion', description: 'No upload delays — pages render in real-time using your CPU.' },
              { title: '📄 All Pages', description: 'Convert every page in a multi-page PDF to individual images.' },
              { title: '🆓 No Watermarks', description: 'Clean output with no branding or watermarks added.' },
              { title: '📱 Cross-Platform', description: 'Works on any device with a modern browser. No app needed.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="PDF to PNG — Frequently Asked Questions" />
      <RelatedTools currentToolId="pdf-to-png" category="PDF Tools" />
    </div>
  );
}
