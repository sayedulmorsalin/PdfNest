import { Presentation, ShieldCheck, Zap, FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import CompressPptxTool from '../../components/pdf/CompressPptxTool';

const faqs = [
  {
    q: 'How can I reduce the size of a PowerPoint file online for free?',
    a: 'Upload your PPT or PPTX presentation to PdfNest\'s free online PowerPoint compressor. Choose your preferred compression level (Low, Recommended, or High), and our tool will shrink your PowerPoint file by re-encoding embedded images and optimizing XML media data directly in your browser. Download your compressed presentation immediately.',
  },
  {
    q: 'Can I compress PPTX files online without losing slide quality?',
    a: 'Yes! PdfNest uses smart compression algorithms that optimize embedded images while preserving slide formatting, text, custom fonts, vector graphics, slide transitions, and animations. The slide content remains crisp while the file size is reduced by up to 70%.',
  },
  {
    q: 'Is the PowerPoint compressor tool completely free to use?',
    a: 'Yes, PdfNest\'s PPTX compressor is 100% free with no registration, no hidden subscriptions, and no watermarks added to your presentation slides.',
  },
  {
    q: 'Is my uploaded PowerPoint presentation secure and private?',
    a: 'Your files are 100% safe. PdfNest performs all compression client-side inside your web browser. Your presentation files are never uploaded to any remote server or stored in the cloud.',
  },
  {
    q: 'What PowerPoint formats are supported?',
    a: 'Our online presentation compressor primarily supports modern Microsoft PowerPoint Open XML presentations (.pptx) and PowerPoint slide shows (.ppsx). Older binary .ppt files can be converted to .pptx in PowerPoint or Google Slides before compressing.',
  },
  {
    q: 'Can I compress large PowerPoint presentations over 50MB or 100MB?',
    a: 'Because PdfNest runs entirely in your browser using local device memory, you can compress very large PowerPoint decks (even over 100MB) without server timeout errors.',
  },
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor/' },
  { name: 'Compress PPTX', path: '/compress-pptx/' },
];

export default function CompressPptx() {
  return (
    <div className="space-y-0">
      <SEO
        title="Compress PowerPoint Online Free – Reduce PPT & PPTX Size | PdfNest"
        description="Compress PowerPoint files online for free. Reduce PPT, PPTX, and presentation file size without losing image quality or slide formatting. Fast, secure, 100% browser-based."
        canonical="/compress-pptx/"
        keywords="compress powerpoint, ppt file compressor, compress powerpoint file, compress ppt, ppt compressor, compress ppt file, compress ppt size online, compress powerpoint online free, free ppt compressor, pptx compressor, compress powerpoint presentation, compress pptx, reduce ppt size, powerpoint file reducer, online ppt file compressor"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PowerPoint Compressor',
            description: 'Free online tool to compress PowerPoint presentations (.pptx) and reduce file size without losing quality.',
            category: 'UtilityApplication',
            features: [
              'Compress PPT and PPTX online',
              'Reduce PowerPoint size free',
              '100% private browser processing',
              'No quality loss option',
              'No watermarks or file limits',
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/20 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-4">
              <Presentation className="w-3.5 h-3.5" />
              <span>PPTX & PPT Presentation Compressor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              Compress PowerPoint Files Online
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reduce the file size of your PowerPoint presentations (<strong className="text-white">.pptx, .ppsx</strong>) quickly and easily.{' '}
              <strong className="text-white">100% free and private</strong> — your presentation slides never leave your device.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Container */}
      <section className="px-4 py-10 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <CompressPptxTool />
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="px-4 py-16 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">How to Compress a PowerPoint Presentation</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            PowerPoint decks often grow massive when you embed high-resolution stock photos, screenshots, or uncompressed artwork. 
            PdfNest makes shrinking your presentation simple and fast in three easy steps:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { step: '1', title: 'Upload Your Presentation', desc: 'Drag and drop your .pptx or .ppsx file into the compressor box above.' },
              { step: '2', title: 'Select Compression Level', desc: 'Choose Low, Recommended, or High compression depending on your desired file size reduction.' },
              { step: '3', title: 'Download Compressed File', desc: 'Get your optimized PowerPoint deck instantly. Check the file size savings before downloading.' },
            ].map((item) => (
              <div key={item.step} className="p-6 border border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-9 h-9 rounded-full bg-orange-400/20 text-orange-400 flex items-center justify-center font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">What Is a PPTX Compressor?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            A <strong>PPTX compressor</strong> is an online utility designed to shrink the file size of Microsoft PowerPoint presentations. Modern presentation files (<code className="text-orange-300">.pptx</code>) are structured as zipped XML packages containing slide XMLs, layout masters, shapes, and embedded image assets (located inside the <code className="text-orange-300">ppt/media/</code> directory).
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            PdfNest's PPTX compressor unzips the presentation package in memory, inspects all embedded image textures, re-compresses high-density JPEGs and PNGs, and repacks the XML archive using maximum DEFLATE compression. This process drastically reduces presentation size while keeping your slides, speaker notes, and graphics intact.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-white">Supported PowerPoint Formats</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01]">
              <div className="text-orange-400 font-bold text-lg mb-1">.PPTX</div>
              <div className="text-xs text-muted-foreground">Standard Microsoft PowerPoint Presentation format (2007 to present). Fully supported.</div>
            </div>
            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01]">
              <div className="text-orange-400 font-bold text-lg mb-1">.PPSX</div>
              <div className="text-xs text-muted-foreground">PowerPoint Slide Show format. Automatically opens in presentation mode. Fully supported.</div>
            </div>
            <div className="p-4 border border-white/10 rounded-xl bg-white/[0.01]">
              <div className="text-orange-400 font-bold text-lg mb-1">.PPT</div>
              <div className="text-xs text-muted-foreground">Legacy binary format. Simply save as .pptx in PowerPoint or Google Slides to compress.</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-white">Why Reduce PowerPoint File Size?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
            <p>
              <strong className="text-white">📧 Bypass Email Limits:</strong> Gmail, Outlook, and Yahoo restrict attachments to 20MB–25MB. Compressing your PPT deck ensures your sales pitch or project update lands in the recipient's inbox without bouncing back.
            </p>
            <p>
              <strong className="text-white">🚀 Faster Cloud Syncing:</strong> Uploading heavy 80MB presentation files to Google Drive, OneDrive, or Dropbox can slow down work sessions. Smaller files sync in seconds.
            </p>
            <p>
              <strong className="text-white">📱 Smooth Mobile Viewing:</strong> Heavy presentation files cause lag when opened on smartphones or tablets during meetings. Compressed presentations load effortlessly across mobile devices.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="px-4 py-16 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Use PdfNest for Presentation Compression?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Private & Secure', description: 'Your PowerPoint deck is processed entirely in your web browser. No files are uploaded to third-party servers.' },
              { icon: Zap, title: 'Instant Compression', description: 'No queue waiting or server delay. Processing finishes in seconds right on your computer or phone.' },
              { icon: CheckCircle2, title: 'No Loss of Slide Layouts', description: 'All typography, bullet points, animations, vectors, and background themes stay perfectly aligned.' },
              { icon: Download, title: 'No Limits or Watermarks', description: 'Compress unlimited PowerPoint files for free without watermarks or mandatory registration.' },
              { icon: FileSpreadsheet, title: 'Smart Image Optimization', description: 'Select between Low, Recommended, or High compression to tune image quality vs. file savings.' },
              { icon: Presentation, title: 'Cross-Platform Ready', description: 'Works seamlessly on Windows PCs, macOS Macs, iPhones, iPads, and Android mobile devices.' },
            ].map((f, i) => (
              <div key={i} className="p-5 border border-white/10 rounded-xl bg-white/[0.02]">
                <f.icon className="w-6 h-6 text-orange-400 mb-3" />
                <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Frequently Asked Questions — PPTX & PPT Compression" />
      <RelatedTools currentToolId="compress-pptx" category="PDF Tools" />
    </div>
  );
}

