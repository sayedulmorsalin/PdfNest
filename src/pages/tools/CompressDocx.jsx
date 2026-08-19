import { FileText, ShieldCheck, Zap, Download, CheckCircle2, FileCheck } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import CompressDocxTool from '../../components/pdf/CompressDocxTool';

const faqs = [
  {
    q: 'How do I compress a Word document online for free?',
    a: 'Upload your .docx document to PdfNest\'s free Word document compressor. Select your compression level (Low, Recommended, or High), and our browser-based engine will optimize embedded images and compress XML data in seconds. Download your reduced Word document immediately.',
  },
  {
    q: 'Can I reduce Word file size online without losing formatting or styles?',
    a: 'Yes! PdfNest specifically targets embedded image files inside the DOCX archive. All paragraph styles, fonts, margins, header/footer layouts, bullet points, tables, and text remain 100% untouched.',
  },
  {
    q: 'Is it safe to compress sensitive Word documents online?',
    a: 'Absolutely. PdfNest performs all processing locally inside your web browser using Web API technology. Your confidential Word documents are never uploaded to server storage or shared online.',
  },
  {
    q: 'How much can I compress a DOCX file?',
    a: 'For documents containing high-resolution pictures, diagrams, or screenshots, file size reduction ranges from 40% to 75%. Text-heavy documents also benefit from maximum ZIP repacking compression.',
  },
  {
    q: 'What Word file formats are supported?',
    a: 'Our compressor supports Microsoft Word Open XML documents (.docx). For older binary .doc files, open them in Word or Google Docs and save as .docx before compressing.',
  },
  {
    q: 'Is there any file size limit for DOCX compression?',
    a: 'Since processing is executed directly on your device, there are no artificial file size limits or paywalls. You can compress documents over 50MB smoothly.',
  },
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor/' },
  { name: 'Compress DOCX', path: '/compress-docx/' },
];

export default function CompressDocx() {
  return (
    <div className="space-y-0">
      <SEO
        title="Compress Word Document Online Free – Reduce DOCX File Size | PdfNest"
        description="Compress Word documents (.docx) online for free. Reduce DOCX file size without losing text formatting, tables, or image quality. Fast, secure, 100% browser-based."
        canonical="/compress-docx/"
        keywords="compress docx, reduce word document size, compress word file, docx compressor, shrink word document, compress docx online, reduce docx size, word file compressor, compress docx size, docx reducer, word document compressor, reduce file size docx, compress word file online, reduce word file size online free, compress docx file online free"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest Word Document Compressor',
            description: 'Free online tool to compress Word documents (.docx) and reduce file size without losing formatting.',
            category: 'UtilityApplication',
            features: [
              'Compress Word document DOCX online',
              'Reduce Word file size free',
              'Preserve text formatting and tables',
              '100% private client-side processing',
              'No watermarks or registration',
            ],
          }),
          buildFAQSchema(faqs),
          buildBreadcrumbSchema(breadcrumbs),
        ]}
      />

      {/* Hero Header */}
      <section className="px-4 py-12 md:py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <FileText className="w-3.5 h-3.5" />
              <span>DOCX & Word File Compressor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Compress Word Documents Online
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Shrink your Word documents (<strong className="text-white">.docx</strong>) instantly while preserving formatting and quality.{' '}
              <strong className="text-white">100% free and private</strong> — your documents are never uploaded to any server.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Container */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <CompressDocxTool />
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">How to Compress a Word Document Online</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Word documents often become bloated when you insert screenshots, photos, or graphic elements. 
            PdfNest optimizes these embedded media assets and compresses document structures in three quick steps:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { step: '1', title: 'Upload Your DOCX', desc: 'Drag and drop your Word file (.docx) into the compressor zone above.' },
              { step: '2', title: 'Choose Compression Setting', desc: 'Select Low, Recommended, or High compression according to your file size reduction target.' },
              { step: '3', title: 'Download Reduced Document', desc: 'Your optimized Word document downloads instantly to your computer or phone.' },
            ].map((item) => (
              <div key={item.step} className="p-6 border border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-9 h-9 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">What Is a DOCX Compressor?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            A <strong>DOCX compressor</strong> is a file optimization tool designed to reduce the megabyte footprint of Microsoft Word files. Modern Word documents (<code className="text-blue-300">.docx</code>) are actually structured ZIP archives containing XML text sheets, style definitions, and an internal media directory (<code className="text-blue-300">word/media/</code>) storing all embedded images.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            PdfNest's DOCX compressor unzips the document package in memory, re-samples and compresses all embedded images using Canvas Web API technology, and re-compresses the XML data structure using DEFLATE compression. This process yields a significantly smaller Word document without modifying your text, headers, footers, or layout formatting.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Supported Word File Formats</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01]">
              <div className="text-blue-400 font-bold text-lg mb-1">.DOCX</div>
              <div className="text-xs text-muted-foreground">Standard Microsoft Word XML Document format (Office 2007–2024, Microsoft 365). Fully supported.</div>
            </div>
            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01]">
              <div className="text-blue-400 font-bold text-lg mb-1">.DOC</div>
              <div className="text-xs text-muted-foreground">Legacy binary format (Word 97-2003). Easily convert to .docx in Word or Google Docs prior to compression.</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Benefits of Compressing Word Files</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              <strong className="text-white">📧 Effortless Email Sharing:</strong> Major email clients reject files larger than 25MB. Compressing your reports or academic papers ensures fast delivery without bounce messages.
            </p>
            <p>
              <strong className="text-white">📑 Portal Submissions:</strong> Job application portals, university assignment systems, and government forms often enforce strict file size thresholds (e.g. 5MB max). Compression guarantees compliance.
            </p>
            <p>
              <strong className="text-white">🔒 Complete Data Privacy:</strong> Confidential legal contracts, resumes, and business reports remain private because all compression occurs locally inside your web browser.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="px-4 py-16 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest's DOCX Reducer?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Private', description: 'Your Word files stay on your machine. All processing happens in-browser with zero uploads.' },
              { icon: CheckCircle2, title: 'Preserves Layouts & Styles', description: 'Headings, tables, custom fonts, lists, and line spacing remain 100% intact after compression.' },
              { icon: Zap, title: 'Lightning Fast', description: 'No upload waits or server queues. Compression completes in seconds on your device.' },
              { icon: Download, title: 'No Limits or Ads', description: 'Compress unlimited DOCX files for free with zero watermarks or registration required.' },
              { icon: FileCheck, title: 'Smart Image Resampling', description: 'Choose Low, Recommended, or High compression to control the balance between quality and file savings.' },
              { icon: FileText, title: 'Works on All Devices', description: 'Use on desktop computers, laptops, iPads, iPhones, and Android smartphones.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl bg-white/[0.02]">
                <f.icon className="w-6 h-6 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Frequently Asked Questions — Word (DOCX) Compression" />
      <RelatedTools currentToolId="compress-docx" category="PDF Tools" />
    </div>
  );
}

