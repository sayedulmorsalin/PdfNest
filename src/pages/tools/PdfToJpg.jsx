import { FileImage } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import PdfToJpgTool from '../../components/pdf/PdfToJpgTool';

const faqs = [
  {
    q: "How do I convert PDF to JPG for free?",
    a: "Upload your PDF to PdfNest's PDF to JPG converter. Each page of your PDF will be converted into a separate JPG image. You can download individual images or all pages at once. No registration required."
  },
  {
    q: "What resolution are the converted images?",
    a: "PdfNest converts PDF pages to high-resolution JPG images (typically 150-300 DPI). The output quality is suitable for both screen viewing and printing."
  },
  {
    q: "Can I convert a multi-page PDF to JPG?",
    a: "Yes! Each page of your PDF becomes a separate JPG image. A 10-page PDF will produce 10 individual JPG files, which you can download individually or as a zip archive."
  },
  {
    q: "What's the difference between PDF to JPG and PDF to PNG?",
    a: "JPG uses lossy compression, producing smaller files ideal for photographs and sharing. PNG uses lossless compression, producing larger files with perfect quality ideal for text-heavy documents and screenshots."
  },
  {
    q: "Is it safe to convert PDFs to images online?",
    a: "With PdfNest, yes. All processing happens locally in your browser. Your PDF is never uploaded to any server, ensuring complete privacy for sensitive documents."
  },
  {
    q: "Why would I convert a PDF to JPG?",
    a: "Common reasons include: embedding PDF content in presentations, sharing on social media (which doesn't support PDFs), creating thumbnails for documents, and making content accessible on platforms that only accept images."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'PDF to JPG' }
];

export default function PdfToJpg() {
  return (
    <div className="space-y-0">
      <SEO
        title="PDF to JPG Converter Free — Convert PDF to Images Online"
        description="Convert PDF pages to JPG images for free. High-quality PDF to image conversion. No watermarks, no registration. Fast, secure, browser-based converter."
        canonical="/pdf-to-jpg"
        keywords="pdf to jpg, pdf to image, convert pdf to jpg, pdf to jpeg, pdf to jpg converter, pdf to image converter, pdf to jpg free, convert pdf to image online"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF to JPG Converter',
            description: 'Free online tool to convert PDF pages to high-quality JPG images.',
            category: 'UtilityApplication',
            features: ['High-resolution output', 'Multi-page support', 'Batch download', 'Browser-based processing', 'Free unlimited use']
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
              <span>PDF to JPG</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Convert PDF to JPG — Free Image Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform PDF pages into high-quality JPG images instantly. Perfect for presentations, 
              social media, and sharing. <strong className="text-white">100% browser-based</strong> — completely private.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <PdfToJpgTool />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Convert PDF to JPG Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Converting PDF pages to images opens up many possibilities — from embedding in presentations to sharing 
            on platforms that don't support PDF. PdfNest makes the conversion fast and simple:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click or drag & drop your PDF file. Multi-page documents are fully supported.' },
              { step: '2', title: 'Convert Pages', desc: 'Each page is rendered as a high-resolution JPG image using advanced rendering.' },
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

          <h2 className="text-2xl font-bold mb-4 text-white">Why Convert PDF to JPG?</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">📊 Presentations & Slides</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PowerPoint and Google Slides don't natively embed PDF pages. By converting to JPG, you can insert 
            PDF content directly into your slides as images, creating seamless presentations that include charts, 
            diagrams, and reference materials from PDF sources.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📱 Social Media Sharing</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Instagram, Twitter, Facebook, and LinkedIn don't support PDF uploads. Converting your infographics, 
            flyers, or one-pagers to JPG makes them shareable across all social platforms. The high-resolution 
            output ensures your content looks great on any screen.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🌐 Website & Email Use</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Embedding images in websites and emails is much simpler than embedding PDFs. Converting key PDF pages 
            to JPG allows you to use them as preview thumbnails, email headers, or inline content that loads 
            instantly without requiring the reader to download a file.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📝 Document Preview Thumbnails</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Many document management systems display thumbnails of files. Converting the first page of your PDFs 
            to JPG creates quick-reference thumbnails that help you identify documents at a glance.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">JPG vs PNG: Which Should You Choose?</h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left border border-white/10 rounded-xl overflow-hidden">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-white font-semibold">Feature</th>
                  <th className="px-4 py-3 text-white font-semibold">JPG</th>
                  <th className="px-4 py-3 text-white font-semibold">PNG</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-t border-white/5"><td className="px-4 py-3">Compression</td><td className="px-4 py-3">Lossy (smaller files)</td><td className="px-4 py-3">Lossless (larger files)</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Best For</td><td className="px-4 py-3">Photos, sharing</td><td className="px-4 py-3">Text, screenshots</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Transparency</td><td className="px-4 py-3">No</td><td className="px-4 py-3">Yes</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">File Size</td><td className="px-4 py-3 text-emerald-400">Smaller</td><td className="px-4 py-3">Larger</td></tr>
                <tr className="border-t border-white/5"><td className="px-4 py-3">Social Media</td><td className="px-4 py-3 text-emerald-400">Preferred</td><td className="px-4 py-3">Supported</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's PDF to JPG Converter?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🎯 High Resolution', description: 'Output images are rendered at 150-300 DPI for crisp quality.' },
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

      <FAQSection faqs={faqs} title="PDF to JPG — Frequently Asked Questions" />
      <RelatedTools currentToolId="pdf-to-jpg" category="PDF Tools" />
    </div>
  );
}
