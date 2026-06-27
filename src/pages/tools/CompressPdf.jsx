import { Link } from 'react-router-dom';
import { FileDown, ArrowRight } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';

const faqs = [
  {
    q: "How do I compress a PDF without losing quality?",
    a: "PdfNest uses smart compression algorithms that remove redundant metadata, optimize embedded images, and streamline the PDF structure. The 'Recommended' setting gives you the best balance — typically 40-70% size reduction with virtually no visible quality loss."
  },
  {
    q: "What is the maximum file size I can compress?",
    a: "Since PdfNest processes files locally in your browser, the limit depends on your device's available memory. Most modern devices can handle PDFs up to 100MB without issues. For very large files, we recommend splitting them first."
  },
  {
    q: "Is my PDF safe when I compress it online?",
    a: "Yes, completely. PdfNest never uploads your files to any server. The compression happens entirely within your browser using JavaScript. Your documents never leave your computer."
  },
  {
    q: "Can I compress multiple PDFs at once?",
    a: "Currently, the compressor handles one file at a time for best results. However, you can compress files back-to-back instantly since there's no upload/download wait time."
  },
  {
    q: "How much can I reduce the file size?",
    a: "Results vary based on the PDF content. Image-heavy PDFs can see 50-80% reduction. Text-heavy documents typically see 20-40% reduction. Scanned PDFs with large images benefit the most from compression."
  },
  {
    q: "Will compressed PDFs work for email attachments?",
    a: "Absolutely! That's one of the most popular use cases. Most email providers limit attachments to 25MB. Our compressor can often bring large PDFs under that limit while maintaining readability."
  },
  {
    q: "Does compression remove any content from my PDF?",
    a: "No. Compression only optimizes how data is stored — it doesn't remove pages, text, or images. All content remains intact and accessible after compression."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'Compress PDF' }
];

export default function CompressPdf() {
  return (
    <div className="space-y-0">
      <SEO
        title="Compress PDF Online Free — Reduce PDF File Size"
        description="Compress PDF files online for free. Reduce PDF file size without losing quality. No watermarks, no registration. Fast, secure, browser-based PDF compressor."
        canonical="/compress-pdf"
        keywords="compress pdf, reduce pdf size, compress pdf online, pdf compressor, shrink pdf, compress pdf free, reduce pdf file size, make pdf smaller, pdf size reducer"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF Compressor',
            description: 'Free online tool to compress and reduce PDF file size without quality loss.',
            category: 'UtilityApplication',
            features: ['Smart compression', 'No quality loss', 'Browser-based processing', 'No watermarks', 'Free unlimited use']
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <FileDown className="w-3 h-3" />
              <span>PDF Compressor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Compress PDF Online — Reduce File Size for Free
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Shrink your PDF files by up to 80% without visible quality loss. Perfect for email attachments, 
              uploads, and storage. <strong className="text-white">100% browser-based</strong> — your files stay private.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 border-2 border-dashed border-white/20 rounded-xl text-center hover:border-primary/50 transition-colors">
            <FileDown className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Compress PDF Files</h3>
            <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">
              Reduce PDF file size while maintaining excellent visual quality.
            </p>
            <Link
              to="/pdf-editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Open PDF Editor <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Compress a PDF File Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Large PDF files can be a headache — they clog up your email, fill your storage, and take forever to upload. 
            PdfNest's free PDF compressor solves this problem instantly. Here's how to use it:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click the upload area or drag and drop your PDF file. We support files of any size.' },
              { step: '2', title: 'Choose Compression Level', desc: 'Select between Low, Recommended, or Maximum compression based on your needs.' },
              { step: '3', title: 'Download Compressed PDF', desc: 'Your smaller PDF downloads instantly. Check the file size comparison to see the savings.' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Compress PDF Files?</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">📧 Email Attachments</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Most email providers (Gmail, Outlook, Yahoo) limit attachments to 25MB. If your PDF exceeds this limit, 
            our compressor can shrink it to fit — often reducing a 50MB file to under 15MB while keeping all content readable.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">☁️ Cloud Storage & Sharing</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Compressed PDFs take less space in Google Drive, Dropbox, and OneDrive. If you're working with dozens 
            of PDF documents daily, compression can save gigabytes of storage over time.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🌐 Website & Web Uploads</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Many websites limit upload sizes for PDF submissions (job applications, government forms, academic portals). 
            Compressing your PDF ensures it meets the requirements without needing to remove content.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📱 Mobile Performance</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Smaller PDFs load faster on mobile devices, use less data, and are easier to share via messaging apps 
            like WhatsApp, Telegram, or iMessage.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Understanding PDF Compression</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PDF compression works by optimizing the internal structure of the file. This includes re-encoding images 
            at lower resolutions, removing unused fonts and metadata, flattening transparency layers, and consolidating 
            duplicate resources. The result is a smaller file that looks virtually identical to the original.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            PdfNest's compression is <strong className="text-white">lossless for text</strong> — every word, number, 
            and character remains perfectly crisp. For images within the PDF, we use intelligent downsampling that 
            reduces resolution only where it won't be noticed (like reducing a 4000px image to 1500px when it's only 
            displayed at 500px in the document).
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's PDF Compressor?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🎯 Smart Compression', description: 'AI-optimized algorithms find the best balance between size and quality.' },
              { title: '🔒 100% Private', description: 'Files stay on your device. No uploads, no cloud processing, no data collection.' },
              { title: '⚡ Instant Results', description: 'No waiting for server processing. Compression happens in real-time.' },
              { title: '📊 Size Comparison', description: 'See exactly how much space you saved with before/after file size display.' },
              { title: '🆓 Always Free', description: 'No subscriptions, no trial limits. Compress unlimited PDFs forever.' },
              { title: '🌍 Works Everywhere', description: 'Desktop, laptop, tablet, phone. Any browser, any platform.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Compress PDF — Frequently Asked Questions" />
      <RelatedTools currentToolId="compress-pdf" category="PDF Tools" />
    </div>
  );
}
