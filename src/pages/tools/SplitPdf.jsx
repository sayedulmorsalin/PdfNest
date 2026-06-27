import { Scissors } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import SplitTool from '../../components/pdf/SplitTool';

const faqs = [
  {
    q: "How do I split a PDF into separate pages?",
    a: "Upload your PDF to PdfNest's Split PDF tool, select which pages you want to extract, and download them as individual PDF files or as a new combined document. It's fast, free, and requires no registration."
  },
  {
    q: "Can I extract specific pages from a PDF?",
    a: "Yes! You can choose individual pages (e.g., pages 1, 3, 7) or a range of pages (e.g., pages 5-10) to extract. The selected pages are saved as a new PDF document."
  },
  {
    q: "Will splitting affect the quality of my PDF?",
    a: "No. Splitting a PDF simply separates pages — it doesn't re-encode or compress anything. Each extracted page retains its original quality, including text, images, and formatting."
  },
  {
    q: "Is it safe to split PDFs online?",
    a: "With PdfNest, absolutely. We process everything locally in your browser. Your PDF files are never uploaded to any server, so your confidential documents remain completely private."
  },
  {
    q: "Can I split a password-protected PDF?",
    a: "If you can open the PDF in your browser (i.e., you know the password), then yes. However, we cannot bypass PDF encryption without the correct password."
  },
  {
    q: "How many pages can I split at once?",
    a: "There's no page limit. Whether your PDF has 5 pages or 500 pages, you can split it freely. Performance depends on your device's capabilities."
  },
  {
    q: "Can I split and then merge specific pages?",
    a: "Absolutely! You can use PdfNest's Split tool to extract the pages you need, then use our Merge PDF tool to combine them with pages from other documents."
  }
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor' },
  { name: 'Split PDF' }
];

export default function SplitPdf() {
  return (
    <div className="space-y-0">
      <SEO
        title="Split PDF Online Free — Extract Pages from PDF"
        description="Split PDF files and extract pages for free. Separate PDF pages, extract specific page ranges, or split into individual files. No watermarks, no registration required."
        canonical="/split-pdf"
        keywords="split pdf, split pdf online, extract pages from pdf, split pdf free, separate pdf pages, pdf splitter, split pdf online free, extract pdf pages, pdf page extractor"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PDF Splitter',
            description: 'Free online tool to split PDF files and extract specific pages into new documents.',
            category: 'UtilityApplication',
            features: ['Extract specific pages', 'Split by page range', 'Split into individual files', 'Browser-based processing', 'Free unlimited use']
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Scissors className="w-3 h-3" />
              <span>PDF Splitter</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Split PDF Online — Extract Pages for Free
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Separate your PDF into individual pages or extract specific page ranges. 
              <strong className="text-white"> Fast, free, and completely private</strong> — no server uploads required.
            </p>
          </div>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <SplitTool />
        </div>
      </section>

      {/* How-To Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">How to Split a PDF File Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Splitting PDFs is essential when you need to share specific pages, reduce file size, or organize 
            large documents into manageable sections. PdfNest makes this incredibly easy:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your PDF', desc: 'Click or drag & drop your PDF file. Any size, any number of pages.' },
              { step: '2', title: 'Select Pages', desc: 'Choose specific pages or page ranges you want to extract from the document.' },
              { step: '3', title: 'Download Results', desc: 'Get your extracted pages as a new PDF file. Original document stays untouched.' },
            ].map(item => (
              <div key={item.step} className="p-5 border border-white/10 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Common Reasons to Split PDFs</h2>

          <h3 className="text-xl font-semibold mb-3 text-white">📧 Share Specific Pages</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Instead of sending a 50-page report when someone only needs page 12, extract just that page and send 
            a clean, focused document. This is especially useful in business contexts where you need to share 
            relevant sections of contracts, proposals, or financial reports.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📚 Organize Study Materials</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Students often receive entire textbook chapters or lecture slides as single PDFs. Splitting them 
            into individual topics or chapters makes studying more organized and efficient. You can also combine 
            extracted pages from different sources using our Merge tool.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">📋 Meet File Size Requirements</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Many online portals have upload limits (5MB, 10MB, 25MB). If your PDF exceeds the limit, splitting 
            it into smaller parts lets you upload each section separately. This is common for job applications, 
            government forms, and academic submissions.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-white">🔐 Remove Sensitive Pages</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If a document contains a mix of public and confidential pages, you can extract only the non-sensitive 
            pages to create a shareable version. Since PdfNest processes locally, even confidential documents 
            remain secure during this process.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Split vs. Extract: What's the Difference?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            <strong className="text-white">Splitting</strong> divides a PDF into multiple separate files (e.g., a 10-page document becomes 
            10 individual PDFs). <strong className="text-white">Extracting</strong> pulls specific pages out of a PDF to create a new, 
            smaller document. PdfNest supports both — you can split every page into its own file, or extract just 
            the pages you need into a single new PDF.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Features of Our PDF Splitter</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '🎯 Page Selection', description: 'Pick individual pages or ranges. Extract exactly what you need.' },
              { title: '🔒 100% Private', description: 'Files never leave your device. Zero server uploads for full security.' },
              { title: '⚡ Instant Results', description: 'No waiting — splitting happens in real-time in your browser.' },
              { title: '📄 Original Quality', description: 'Extracted pages maintain their original resolution and formatting.' },
              { title: '🆓 No Limits', description: 'No page limits, no file size caps, no daily usage restrictions.' },
              { title: '🔗 Works with Merge', description: 'Extract pages, then combine them with other PDFs using our Merge tool.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl">
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Split PDF — Frequently Asked Questions" />
      <RelatedTools currentToolId="split-pdf" category="PDF Tools" />
    </div>
  );
}
