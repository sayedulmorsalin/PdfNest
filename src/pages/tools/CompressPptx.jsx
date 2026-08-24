import { Presentation, ShieldCheck, Zap, FileSpreadsheet, Download, CheckCircle2, Cpu, HardDrive, Sparkles, Lock, ArrowRight, Layers, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO, { buildSoftwareAppSchema, buildFAQSchema, buildBreadcrumbSchema } from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import FAQSection from '../../components/FAQSection';
import RelatedTools from '../../components/RelatedTools';
import CompressPptxTool from '../../components/pdf/CompressPptxTool';

const faqs = [
  {
    q: 'How can I reduce the size of a PowerPoint file online for free?',
    a: 'Upload your PPT or PPTX presentation to PdfNest\'s free online PowerPoint compressor. Choose your preferred compression level (Low, Recommended, or High), and our tool shrinks your PowerPoint file by re-encoding embedded images and optimizing XML media data directly in your browser. Download your compressed presentation immediately with no watermarks.',
  },
  {
    q: 'Can I compress PPT files larger than 300MB or 500MB online for free?',
    a: 'Yes! Unlike cloud-based tools that cap uploads at 25MB or 50MB and throw "payload too large" errors, PdfNest executes 100% client-side in your web browser. This means you can compress massive PowerPoint files (over 300MB or 500MB) without server timeouts, queue wait times, or paid upgrades.',
  },
  {
    q: 'Can I compress PPTX files online without losing slide quality?',
    a: 'Yes. PdfNest uses intelligent compression algorithms that downscale and re-encode high-density image textures while preserving slide layout geometry, vector shapes, custom typography, slide animations, transitions, and speaker notes. Text and vectors remain 100% crisp.',
  },
  {
    q: 'How does browser-based compression protect confidential business pitch decks?',
    a: 'Your presentations and slides never leave your device. All decompression, image optimization, and repacking are performed locally using your computer or phone\'s browser memory. No data is ever sent to external cloud servers, ensuring total privacy for proprietary company decks, student assignments, and financial presentations.',
  },
  {
    q: 'Will compressing my PowerPoint file delete animations, transitions, or speaker notes?',
    a: 'No. PdfNest only targets the heavy binary raster assets inside the ppt/media/ folder (like large JPEG, PNG, or TIFF photos). All XML structure defining animations, slide transitions, master slides, speaker notes, and embedded tables remains completely untouched.',
  },
  {
    q: 'What PowerPoint formats are supported (.pptx, .ppsx, .ppt)?',
    a: 'Our online presentation compressor supports modern Microsoft PowerPoint Open XML presentations (.pptx) and PowerPoint slide shows (.ppsx). If you have a legacy binary .ppt file (pre-2007), simply open it in Microsoft PowerPoint or Google Slides and click "Save As .pptx" before compressing.',
  },
  {
    q: 'Why do PowerPoint presentation files get so large in the first place?',
    a: 'PowerPoint files swell in size primarily due to uncompressed media. When you paste high-resolution camera photos, 4K screenshots, or uncompressed stock images into slides, PowerPoint embeds the full-size image file inside the presentation package. A 20-slide presentation can easily reach 100MB to 300MB+ just from embedded media assets.',
  },
  {
    q: 'How do I choose between Low, Recommended, and High compression?',
    a: '• Low Compression: Best if you plan to present on massive 4K conference room screens or high-DPI projectors. Retains high image fidelity with ~30-40% file reduction.\n• Recommended: The sweet spot for 95% of users. Ideal for email attachments, Google Classroom, and LMS submissions with ~50-70% size reduction.\n• High Compression: Best when you need the absolute smallest file size to meet strict 20MB email limits or low-bandwidth downloads.',
  },
  {
    q: 'Is there any fee, daily limit, or watermark added to compressed slides?',
    a: 'PdfNest\'s PowerPoint compressor is 100% free with unlimited daily usage, no file count limits, no email registration requirements, and zero watermarks.',
  },
];

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'PDF Tools', path: '/pdf-editor/' },
  { name: 'Compress PPTX', path: '/compress-pptx/' },
];

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Compress a PowerPoint Presentation Online for Free',
  description: 'Step-by-step guide to reducing the file size of Microsoft PowerPoint (.pptx, .ppsx) presentations online using PdfNest.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Upload Presentation',
      text: 'Drag and drop your .pptx or .ppsx file into the compressor box.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: 'Select Compression Level',
      text: 'Choose between Low, Recommended, or High compression based on your file size goal.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: 'Download Compressed PPTX',
      text: 'Click Compress PPTX and instantly download your lightweight presentation file.',
      position: 3,
    },
  ],
};

export default function CompressPptx() {
  return (
    <div className="space-y-0">
      <SEO
        title="Compress PowerPoint Online Free – Reduce PPT & PPTX Size (300MB+) | PdfNest"
        description="Compress PowerPoint files online for free. Reduce PPT, PPTX, and large presentation decks (even 300MB+) without losing image quality or slide layouts. Fast, secure, 100% private in-browser."
        canonical="/compress-pptx/"
        keywords="compress powerpoint, ppt compressor, compress ppt, compress powerpoint file, ppt file compressor, compress ppt file, reduce ppt size online, compress ppt online more than 300mb free, compress pptx, free ppt compressor, compress powerpoint presentation, powerpoint size reducer, reduce pptx size online free, shrink powerpoint file, ppt size reducer"
        schemas={[
          buildSoftwareAppSchema({
            name: 'PdfNest PowerPoint Compressor',
            description: 'Free online tool to compress PowerPoint presentations (.pptx, .ppsx) and reduce file size up to 80% without losing visual quality. Handles large files over 300MB.',
            category: 'UtilityApplication',
            features: [
              'Compress PPT and PPTX presentations online',
              'Reduce PowerPoint size free with zero watermarks',
              'Support for large files over 300MB without server limits',
              '100% private client-side browser processing',
              'Smart media and image re-encoding',
              'Preserves slide animations, formatting, and notes',
            ],
          }),
          buildFAQSchema(faqs),
          buildBreadcrumbSchema(breadcrumbs),
          howToSchema,
        ]}
      />

      {/* Hero Header */}
      <section className="px-4 py-12 md:py-16 border-b border-white/5 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={breadcrumbs} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-400/10 border border-orange-400/25 text-orange-400 text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
              <Presentation className="w-3.5 h-3.5" />
              <span>Free Online PPT & PPTX Compressor</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-white/95 to-white/70 bg-clip-text text-transparent tracking-tight">
              Compress PowerPoint Files Online
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Shrink the file size of your PowerPoint presentations (<strong className="text-white">.pptx, .ppsx</strong>) quickly and easily.{' '}
              <strong className="text-white">Handles large decks (even 300MB+)</strong> with{' '}
              <strong className="text-white">100% client-side privacy</strong> — your confidential slides never leave your browser.
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
          <div className="text-center md:text-left mb-10">
            <h2 className="text-3xl font-bold mb-3 text-white">How to Compress a PowerPoint Presentation in 3 Steps</h2>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              PowerPoint decks quickly become unmanageable when you embed high-resolution photos, screenshots, or diagram textures. 
              With PdfNest, optimizing your presentation takes just a few seconds without installing heavy desktop software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { 
                step: '1', 
                title: 'Upload Your Presentation', 
                desc: 'Drag and drop your .pptx or .ppsx file into the compressor above. Works with decks of any size, including files over 100MB–300MB.' 
              },
              { 
                step: '2', 
                title: 'Select Compression Level', 
                desc: 'Pick Low (highest quality), Recommended (optimal balance for email/web), or High (maximum size reduction).' 
              },
              { 
                step: '3', 
                title: 'Download Compressed PPTX', 
                desc: 'Click Compress PPTX and download your lightweight presentation immediately. See exact MB savings before downloading.' 
              },
            ].map((item) => (
              <div key={item.step} className="p-6 border border-white/10 rounded-2xl bg-white/[0.02] hover:border-orange-400/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-orange-400/20 text-orange-400 flex items-center justify-center font-bold text-base mb-4 border border-orange-400/30">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-2 text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Large Files (300MB+) Feature Focus */}
          <div className="p-8 rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-white/[0.02] to-transparent mb-16">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-400/20 border border-orange-400/30 flex items-center justify-center shrink-0 text-orange-400">
                <HardDrive className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>High-Capacity Processing</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Compressing Large PowerPoint Files Online (300MB, 500MB+)</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Most online file compressors rely on remote cloud servers with strict <strong>25MB to 50MB upload limits</strong>. When you try to upload a heavy 200MB or 300MB PowerPoint presentation, cloud tools timeout, fail with <code className="text-orange-300">413 Payload Too Large</code>, or demand expensive monthly subscriptions.
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  <strong className="text-white">PdfNest works differently.</strong> Our PPTX engine operates entirely within your browser using your local device memory and Web Streams. There are <strong className="text-white">no server upload limits</strong>, no queues, and no timeouts. Whether your deck is 15MB, 150MB, or 400MB+, PdfNest decompresses and optimizes every slide asset right on your machine with lightning speed.
                </p>
              </div>
            </div>
          </div>

          {/* Under The Hood Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 items-start">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-orange-400" />
                <span>How PPTX Compression Works Under the Hood</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Microsoft PowerPoint files with the <code className="text-orange-300">.pptx</code> extension are actually structured ZIP archives containing XML document schemas, theme definitions, layout geometry, and a dedicated media directory (<code className="text-orange-300">ppt/media/</code>).
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                When you paste photos or charts into PowerPoint, the application embeds raw, uncompressed image data directly inside that media directory. Over time, a presentation with 20–30 slides can easily balloon into hundreds of megabytes.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                PdfNest inspects the archive in memory, extracts all raster image textures, intelligently re-encodes oversized JPEGs and PNGs using modern compression algorithms, and repacks the entire XML package using maximum <strong>Level-9 DEFLATE compression</strong>.
              </p>
            </div>

            <div className="p-6 border border-white/10 rounded-2xl bg-white/[0.02] space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Supported PowerPoint Formats</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 border border-white/5 rounded-xl bg-white/[0.02]">
                  <div className="text-orange-400 font-bold text-sm">.PPTX (Microsoft PowerPoint Open XML)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">The standard format used by PowerPoint 2007 through Office 365, Google Slides, and Keynote. Fully supported.</div>
                </div>
                <div className="p-3 border border-white/5 rounded-xl bg-white/[0.02]">
                  <div className="text-orange-400 font-bold text-sm">.PPSX (PowerPoint Slide Show)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Automated slideshow presentations that launch directly into fullscreen presentation mode. Fully supported.</div>
                </div>
                <div className="p-3 border border-white/5 rounded-xl bg-white/[0.02]">
                  <div className="text-orange-400 font-bold text-sm">.PPT (Legacy Binary Presentation)</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Older pre-2007 format. Simply open the file in PowerPoint or Google Slides and click "Save As .pptx" to compress here.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-4 text-center md:text-left">
              PdfNest vs Traditional Cloud Compressors
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Compare how PdfNest's client-side technology stacks up against traditional server-based presentation tools:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse border border-white/10 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white font-semibold">
                    <th className="p-4">Feature</th>
                    <th className="p-4 text-orange-400">PdfNest PPT Compressor</th>
                    <th className="p-4 text-muted-foreground">Standard Cloud Compressors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-muted-foreground">
                  <tr className="bg-white/[0.01]">
                    <td className="p-4 font-medium text-white">Maximum File Size</td>
                    <td className="p-4 text-emerald-400 font-semibold">Unlimited (300MB, 500MB+ supported)</td>
                    <td className="p-4">Capped at 25MB–50MB (Paid upgrade required)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Data Privacy & Security</td>
                    <td className="p-4 text-emerald-400 font-semibold">100% In-Browser (Zero server upload)</td>
                    <td className="p-4">Uploaded & stored on third-party cloud servers</td>
                  </tr>
                  <tr className="bg-white/[0.01]">
                    <td className="p-4 font-medium text-white">Upload & Download Wait</td>
                    <td className="p-4 text-emerald-400 font-semibold">Instant (No network upload transfer)</td>
                    <td className="p-4">Slow (Must upload entire multi-MB file to server)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-white">Cost & Pricing</td>
                    <td className="p-4 text-emerald-400 font-semibold">100% Free forever</td>
                    <td className="p-4">Freemium with recurring subscriptions</td>
                  </tr>
                  <tr className="bg-white/[0.01]">
                    <td className="p-4 font-medium text-white">Watermarks & Limits</td>
                    <td className="p-4 text-emerald-400 font-semibold">No watermarks, no daily task limits</td>
                    <td className="p-4">1–2 tasks per day on free tier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Practices Section */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-white">Best Practices to Keep PowerPoint Presentations Small</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-orange-400" />
                  <span>Resize Images Before Inserting</span>
                </div>
                <p>
                  Avoid dropping 24-megapixel camera photos or 4K raw wallpapers onto a single slide. Downscaling your images to 1920×1080 before embedding saves significant space.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-orange-400" />
                  <span>Use SVG Vector Icons Instead of PNGs</span>
                </div>
                <p>
                  Vector icons and shapes scale infinitely with zero pixelation and consume only a few kilobytes compared to dense PNG bitmap files.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-orange-400" />
                  <span>Clean Up Slide Masters & Layouts</span>
                </div>
                <p>
                  PowerPoint templates often retain unused slide masters and hidden background artwork. Deleting unused masters strips hidden megabytes.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.01] space-y-2">
                <div className="font-semibold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-orange-400" />
                  <span>Link Heavy Videos Instead of Embedding</span>
                </div>
                <p>
                  Embedding a 1080p MP4 directly into slides adds 100MB+ instantly. For sharing, consider hosting the video on YouTube or Loom and linking to it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="px-4 py-16 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-white">Why Choose PdfNest for Presentation Compression?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: '100% Private & Confidential', description: 'Your PowerPoint deck is processed strictly in your browser. Perfect for private sales pitch decks and corporate data.' },
              { icon: Zap, title: 'Instant In-Memory Processing', description: 'No upload queues or server latency. Processing finishes in seconds directly on your CPU.' },
              { icon: CheckCircle2, title: 'Preserves Layouts & Notes', description: 'All typography, animations, vector shapes, speaker notes, and slide transitions remain 100% intact.' },
              { icon: Download, title: 'No Limits or Watermarks', description: 'Compress unlimited PowerPoint files for free with zero watermarks or registration barriers.' },
              { icon: FileSpreadsheet, title: 'Tunable Quality Levels', description: 'Switch between Low, Recommended, and High compression to match your exact file size targets.' },
              { icon: Lock, title: 'Cross-Device Compatibility', description: 'Works seamlessly on Windows PCs, macOS Macs, Chromebooks, iPads, iPhones, and Android devices.' },
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

      {/* In-depth Article Promo Banner */}
      <section className="px-4 py-10 border-b border-white/5 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-400">Comprehensive Guide</div>
            <h3 className="text-lg font-bold text-white">Want to learn more about PowerPoint file size optimization?</h3>
            <p className="text-xs text-muted-foreground">Read our complete tutorial on reducing presentation sizes for email and web.</p>
          </div>
          <Link
            to="/blog/how-to-compress-powerpoint-presentation-reduce-file-size/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition-colors shrink-0 shadow-md"
          >
            <span>Read PPTX Compression Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <FAQSection faqs={faqs} title="Frequently Asked Questions — PowerPoint PPT & PPTX Compression" />
      <RelatedTools currentToolId="compress-pptx" category="PDF Tools" />
    </div>
  );
}
