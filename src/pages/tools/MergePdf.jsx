import { Merge, FileUp, ArrowRight } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import MergeTool from '../../components/pdf/MergeTool';

const faqs = [
  {
    q: "How do I merge PDF files online for free?",
    a: "Simply upload your PDF files to PdfNest's Merge PDF tool, arrange them in the order you want, and click 'Merge'. The combined PDF will download instantly. No registration, no watermarks — completely free."
  },
  {
    q: "Is there a limit to how many PDFs I can merge?",
    a: "There is no strict limit on the number of files. You can merge as many PDFs as your browser can handle. For very large batches (50+ files or hundreds of MBs), we recommend merging in groups for best performance."
  },
  {
    q: "Will the quality of my PDFs be affected after merging?",
    a: "No. PdfNest preserves the original quality of each PDF page. Text, images, hyperlinks, bookmarks, and formatting remain exactly as they were in the source files."
  },
  {
    q: "Is it safe to merge PDFs online?",
    a: "Absolutely. PdfNest processes everything locally in your browser using JavaScript. Your files are never uploaded to any server. This means your sensitive documents stay 100% private on your device."
  },
  {
    q: "Can I rearrange the page order before merging?",
    a: "Yes! After uploading your PDFs, you can drag and drop to reorder them before merging. You can also remove individual files if you change your mind."
  },
  {
    q: "What file formats are supported?",
    a: "The Merge PDF tool accepts standard PDF files (.pdf). If you need to merge other document types (Word, images), first convert them to PDF using our PDF Converter tool, then merge them."
  },
  {
    q: "Does merging PDFs require any software installation?",
    a: "No. PdfNest is a web-based tool that runs entirely in your browser. There's nothing to download, install, or update. It works on Windows, Mac, Linux, and mobile devices."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'Merge PDF' }
];

export default function MergePdf() {
  return (
    <div className="space-y-0">
      <SEO
        title="Merge PDF Online Free — Combine PDF Files Instantly"
        description="Merge multiple PDF files into one document for free. No watermarks, no registration. Fast, secure, browser-based PDF merger. Combine PDFs online in seconds."
        canonical="/merge-pdf"
        keywords="merge pdf, combine pdf, merge pdf online, merge pdf free, combine pdf files, join pdf, pdf merger, merge pdf files online free, combine multiple pdfs"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest Merge PDF',
            description: 'Free online tool to merge and combine multiple PDF files into one document.',
            category: 'UtilityApplication',
            features: ['Merge unlimited PDFs', 'Drag and drop reordering', 'No file size limit', 'Browser-based processing', 'No registration required']
          }),
          buildFAQSchema(faqs),
          buildBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Hero Section */}
      <section className="px-4 py-12 md:py-20 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-400/10 border border-rose-400/20 text-rose-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Merge className="w-3 h-3" />
              <span>PDF Merger</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Merge PDF Files Online — Free & Secure
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combine multiple PDF documents into a single file in seconds. No uploads to any server — 
              everything is processed <strong className="text-white">locally in your browser</strong> for maximum privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <MergeTool />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Merge PDF Files Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Merging PDF files is one of the most common document tasks, whether you're combining invoices, 
            reports, contracts, or academic papers. PdfNest makes this process effortless with our free online 
            PDF merger tool. Here's how to get started:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { step: '1', title: 'Upload Your PDFs', desc: 'Click the upload area or drag and drop your PDF files. You can select multiple files at once.' },
              { step: '2', title: 'Arrange the Order', desc: 'Reorder your files by dragging them into the sequence you want for the final document.' },
              { step: '3', title: 'Click Merge', desc: 'Hit the Merge button and your combined PDF will download automatically. That\'s it!' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Use PdfNest to Merge PDFs?</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-white">🔒 100% Privacy — No Server Uploads</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Unlike most online PDF tools, PdfNest never uploads your files to a server. The entire merging 
            process happens right inside your web browser using JavaScript. This means your confidential 
            documents — contracts, financial reports, personal files — never leave your computer. There's no 
            risk of data breaches, no privacy policies to worry about, and no traces left on remote servers.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">⚡ Lightning Fast</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Because processing happens locally, there's no upload/download delay. Merging even large PDF files 
            takes just seconds. Your internet speed doesn't affect performance — everything runs at the speed 
            of your computer's processor.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🆓 Completely Free, No Limits</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            There are no hidden costs, no premium tiers, no "merge 3 files free then pay" tricks. PdfNest's 
            PDF merger is 100% free with no file count limits, no file size restrictions, and no watermarks 
            added to your output. Use it as much as you need.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📱 Works on Any Device</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PdfNest works on Windows, macOS, Linux, Android, and iOS. Any device with a modern web browser 
            (Chrome, Firefox, Safari, Edge) can use our PDF merger. No software installation required.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Common Use Cases for Merging PDFs</h2>
          <ul className="text-muted-foreground space-y-2 mb-6 list-disc list-inside">
            <li><strong className="text-white">Business:</strong> Combine invoices, contracts, and proposals into a single document for clients</li>
            <li><strong className="text-white">Education:</strong> Merge lecture notes, assignments, and study materials into one PDF</li>
            <li><strong className="text-white">Legal:</strong> Combine signed pages with the main contract document</li>
            <li><strong className="text-white">Personal:</strong> Merge scanned receipts or travel documents for easy organization</li>
            <li><strong className="text-white">HR:</strong> Combine resumes, cover letters, and certificates into one application package</li>
          </ul>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Features of Our PDF Merger</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🎯 Preserves Quality', description: 'All text, images, links, and formatting stay intact after merging.' },
              { title: '🔒 Browser-Based', description: 'Files never leave your device. Zero server uploads for maximum security.' },
              { title: '⚡ Instant Results', description: 'No waiting for uploads or server processing. Merge PDFs in seconds.' },
              { title: '📱 Cross-Platform', description: 'Works on desktop, tablet, and mobile. No app installation needed.' },
              { title: '🆓 No Watermarks', description: 'Your merged PDF is clean — no "Powered by" branding or watermarks.' },
              { title: '♾️ Unlimited Usage', description: 'No daily limits, no file count caps. Merge as many PDFs as you want.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={faqs} title="Merge PDF — Frequently Asked Questions" />

      {/* Related Tools */}
      <RelatedTools currentToolId="merge-pdf" category="PDF Tools" />
    </div>
  );
}
