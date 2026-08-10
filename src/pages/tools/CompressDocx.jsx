import { FileText } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import CompressDocxTool from '../../components/pdf/CompressDocxTool';

const faqs = [
  {
    q: 'How do I compress a Word document online?',
    a: 'Upload your .docx file to PdfNest\'s DOCX compressor. The tool unpacks the document, optimizes all embedded images, and repacks it with maximum compression — entirely in your browser. Click "Compress DOCX" and your smaller file downloads automatically.',
  },
  {
    q: 'Is it safe to compress Word documents online?',
    a: 'Yes. PdfNest never uploads your files to any server. Everything is processed locally in your browser using JavaScript. Your documents stay on your computer at all times.',
  },
  {
    q: 'Will my text and formatting be preserved?',
    a: 'Absolutely. Only image data within the document is re-optimized. All text, styles, fonts, tables, and page layouts remain completely intact after compression.',
  },
  {
    q: 'How much can I reduce a Word document\'s file size?',
    a: 'Results depend on how many images are embedded. Image-heavy documents can see 40–70% reduction. Mostly-text documents will see a smaller but still meaningful reduction from ZIP repacking optimization.',
  },
  {
    q: 'What is the maximum file size I can compress?',
    a: 'Since processing happens in your browser, the limit depends on your device memory. Most modern devices handle files up to 100MB without issues.',
  },
  {
    q: 'Can I compress .doc files (older Word format)?',
    a: 'Currently the compressor supports the modern .docx format (Office Open XML). For .doc files, consider converting to .docx first using Microsoft Word or a free online converter.',
  },
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'Compress DOCX' },
];

export default function CompressDocx() {
  return (
    <div className="space-y-0">
      <SEO
        title="Compress Word Document Online Free — Reduce DOCX File Size"
        description="Compress Word documents (.docx) online for free. Reduce DOCX file size without losing formatting or quality. No watermarks, no registration. Fast, secure, browser-based."
        canonical="/compress-docx"
        keywords="compress docx, reduce word document size, compress word file, docx compressor, shrink word document, compress docx online, reduce docx size, word file compressor"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest DOCX Compressor',
            description: 'Free online tool to compress and reduce Word document file size without losing formatting.',
            category: 'UtilityApplication',
            features: ['Image optimization', 'No formatting loss', 'Browser-based processing', 'No watermarks', 'Free unlimited use'],
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
              <span>DOCX Compressor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Compress Word Document — Reduce DOCX Size for Free
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Shrink your Word documents by optimizing embedded images and repacking with maximum compression.{' '}
              <strong className="text-white">100% browser-based</strong> — your files stay private and are never uploaded.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <CompressDocxTool />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Compress a Word Document Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Large Word documents can be difficult to share over email or messaging apps, and they consume unnecessary
            storage space. PdfNest's free DOCX compressor reduces file size by intelligently optimizing embedded images
            without touching any of your text or formatting. Here's how:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your DOCX', desc: 'Click the upload area or drag and drop your .docx file. Supports any Word document.' },
              { step: '2', title: 'Choose Compression Level', desc: 'Select Low, Recommended, or High compression based on your quality vs. size preference.' },
              { step: '3', title: 'Download Compressed File', desc: 'Your smaller .docx downloads instantly. Check the size comparison to see the savings.' },
            ].map((item) => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Compress DOCX Files?</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">📧 Email Attachments</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Email providers like Gmail and Outlook typically limit attachments to 25MB. Word documents with many
            high-resolution screenshots or photos can easily exceed this. Compression often brings them well under the limit.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">☁️ Cloud Storage & Sharing</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Smaller files sync faster to Google Drive, OneDrive, and Dropbox. If you manage a team sharing documents
            daily, compression can save significant bandwidth and storage costs over time.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📤 Form & Portal Uploads</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Many government, academic, and HR portals impose strict file size limits on document uploads. Compressing
            your DOCX ensures it meets those requirements without removing any content.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">How DOCX Compression Works</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The .docx format is actually a ZIP archive containing XML files for content, styles, and relationships, plus
            an image folder (word/media/) for any embedded pictures. PdfNest's compressor opens this archive, re-encodes
            each image at optimized quality using your browser's built-in rendering engine, then repacks the entire
            archive using maximum DEFLATE compression.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The result is a fully valid .docx file that opens normally in Microsoft Word, Google Docs, LibreOffice, and
            any other compatible application — just smaller.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's DOCX Compressor?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🔒 100% Private', description: 'Your Word documents never leave your device. All processing happens locally in your browser.' },
              { title: '📝 Formatting Preserved', description: 'Text, styles, fonts, tables, and layouts remain completely unchanged after compression.' },
              { title: '⚡ Instant Results', description: 'No server round-trips. Compression happens in real-time without any waiting.' },
              { title: '📊 Size Comparison', description: 'See exactly how much space you saved with before/after file size display.' },
              { title: '🆓 Always Free', description: 'No subscriptions, no trial limits. Compress unlimited Word documents forever.' },
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

      <FAQSection faqs={faqs} title="Compress DOCX — Frequently Asked Questions" />
      <RelatedTools currentToolId="compress-docx" category="PDF Tools" />
    </div>
  );
}
