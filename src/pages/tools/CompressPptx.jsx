import { Presentation } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import CompressPptxTool from '../../components/pdf/CompressPptxTool';

const faqs = [
  {
    q: 'How do I compress a PowerPoint presentation online?',
    a: 'Upload your .pptx file to PdfNest\'s PPTX compressor. The tool unpacks the presentation, optimizes all embedded images and media assets, and repacks with maximum compression — all locally in your browser. Click "Compress PPTX" and your smaller file downloads automatically.',
  },
  {
    q: 'Will my slide content and animations be preserved?',
    a: 'Yes. The compressor only targets image files within the presentation. All slide layouts, text, shapes, transitions, animations, and theme data remain completely intact.',
  },
  {
    q: 'Is it safe to compress PowerPoint files online?',
    a: 'Absolutely. PdfNest processes everything locally in your browser. Your files are never uploaded to any server — complete privacy guaranteed.',
  },
  {
    q: 'How much can I reduce a PowerPoint file size?',
    a: 'Presentation files are often dominated by image assets. Depending on the number and resolution of images, you can typically achieve 30–70% file size reduction. The "High Compression" setting maximizes savings.',
  },
  {
    q: 'What is the maximum file size supported?',
    a: 'Since all processing happens in your browser, the limit depends on your device\'s available memory. Most modern computers handle files up to 100MB without issues.',
  },
  {
    q: 'Can I compress .ppt files (older PowerPoint format)?',
    a: 'Currently the compressor supports the modern .pptx format (Office Open XML). For .ppt files, open them in PowerPoint or LibreOffice and save as .pptx first.',
  },
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'Compress PPTX' },
];

export default function CompressPptx() {
  return (
    <div className="space-y-0">
      <SEO
        title="Compress PowerPoint Online Free — Reduce PPTX File Size"
        description="Compress PowerPoint presentations (.pptx) online for free. Reduce PPTX file size without losing slide quality or formatting. No watermarks, no registration. Fast, secure, browser-based."
        canonical="/compress-pptx"
        keywords="compress pptx, reduce powerpoint size, compress powerpoint file, pptx compressor, shrink presentation, compress pptx online, reduce pptx size, powerpoint file compressor"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PPTX Compressor',
            description: 'Free online tool to compress and reduce PowerPoint presentation file size without losing quality.',
            category: 'UtilityApplication',
            features: ['Image optimization', 'No slide content loss', 'Browser-based processing', 'No watermarks', 'Free unlimited use'],
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Presentation className="w-3 h-3" />
              <span>PPTX Compressor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Compress PowerPoint — Reduce PPTX Size for Free
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Shrink your PowerPoint presentations by optimizing embedded images and repacking with maximum compression.{' '}
              <strong className="text-white">100% browser-based</strong> — your files stay private and are never uploaded.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <CompressPptxTool />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Compress a PowerPoint File Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            PowerPoint presentations can grow very large when they contain many high-resolution images, screenshots, or
            background graphics. PdfNest's PPTX compressor significantly reduces file size by intelligently optimizing all
            embedded image assets — without affecting your slides, animations, or formatting.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PPTX', desc: 'Click the upload area or drag and drop your .pptx file. Works with any PowerPoint presentation.' },
              { step: '2', title: 'Choose Compression Level', desc: 'Select Low, Recommended, or High compression to balance slide image quality against file size.' },
              { step: '3', title: 'Download Compressed File', desc: 'Your smaller .pptx downloads instantly. Check the before/after size to see the savings.' },
            ].map((item) => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-400/20 text-orange-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Compress PPTX Files?</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">📧 Email & Messaging</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Email providers limit attachments to 25MB. Messaging apps like WhatsApp and Telegram have similar restrictions.
            Compressing your presentation makes it easy to share without needing cloud storage links.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">☁️ Cloud Upload Speed</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Smaller files upload and sync to Google Drive, OneDrive, and Dropbox much faster. For remote teams
            collaborating on presentations in real-time, this can significantly improve workflow efficiency.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🎤 Conference & Event Submission</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Academic conferences, business events, and webinar platforms often enforce strict file size limits for
            presentation submissions. Compression ensures your deck meets requirements without cutting content.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">How PPTX Compression Works</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Just like .docx files, .pptx presentations are ZIP archives containing XML slide definitions plus a media
            folder (ppt/media/) with all image assets. PdfNest opens this archive, re-encodes each image at your chosen
            quality level using your browser's rendering engine, then repacks the entire archive using maximum DEFLATE compression.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The output is a fully valid .pptx file that opens normally in PowerPoint, Google Slides, LibreOffice Impress,
            and all other compatible applications.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's PPTX Compressor?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🔒 100% Private', description: 'Your presentations never leave your device. All processing happens locally in your browser.' },
              { title: '🎨 Slides Preserved', description: 'Layouts, animations, transitions, and slide content remain completely unchanged.' },
              { title: '⚡ Instant Results', description: 'No server upload. Compression happens in real-time right in your browser.' },
              { title: '📊 Size Comparison', description: 'See exactly how much space you saved with before/after file size display.' },
              { title: '🆓 Always Free', description: 'No subscriptions, no trial limits. Compress unlimited presentations forever.' },
              { title: '🌍 Works Everywhere', description: 'Any modern browser on desktop, laptop, tablet, or phone.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Compress PPTX — Frequently Asked Questions" />
      <RelatedTools currentToolId="compress-pptx" category="PDF Tools" />
    </div>
  );
}
