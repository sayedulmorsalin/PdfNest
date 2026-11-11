import { Link } from 'react-router-dom';
import { 
  ArrowRight, FileText, FileJson, Image as ImageIcon, Calculator, Code, 
  Merge, Scissors, FileDown, Zap, FileImage, ShieldCheck 
} from 'lucide-react';

/**
 * All available verified tools with comprehensive metadata
 */
export const ALL_TOOLS = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDF files into one clean document with custom page reordering.',
    path: '/merge-pdf/',
    icon: Merge,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    category: 'PDF Management',
    popular: true,
    supportedFormats: ['.pdf'],
    maxSize: '100 MB',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size up to 80% without visible loss in text or image quality.',
    path: '/compress-pdf/',
    icon: FileDown,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    category: 'PDF Editing',
    popular: true,
    supportedFormats: ['.pdf'],
    maxSize: '100 MB',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    shortDescription: 'Extract specific pages or separate PDF pages into individual documents instantly.',
    path: '/split-pdf/',
    icon: Scissors,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    category: 'PDF Management',
    popular: true,
    supportedFormats: ['.pdf'],
    maxSize: '100 MB',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    shortDescription: 'Convert PDF documents into editable Microsoft Word (.docx) files preserving headings & bullets.',
    path: '/pdf-to-word/',
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    category: 'PDF Conversion',
    popular: true,
    supportedFormats: ['.pdf'],
    maxSize: '50 MB',
  },
  {
    id: 'compress-pptx',
    name: 'Compress PPTX',
    shortDescription: 'Shrink large PowerPoint presentations (even 300MB+) by optimizing high-res embedded slides.',
    path: '/compress-pptx/',
    icon: FileDown,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    category: 'Office Tools',
    popular: true,
    supportedFormats: ['.pptx', '.ppsx'],
    maxSize: '300 MB+',
  },
  {
    id: 'compress-docx',
    name: 'Compress DOCX',
    shortDescription: 'Reduce Word document file size while preserving fonts, tables, margins, and formatting.',
    path: '/compress-docx/',
    icon: FileDown,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    category: 'Office Tools',
    popular: true,
    supportedFormats: ['.docx'],
    maxSize: '100 MB',
  },
  {
    id: 'pdf-editor',
    name: 'All-in-One PDF Editor',
    shortDescription: 'Comprehensive in-browser PDF suite: convert, merge, split, and compress in one workspace.',
    path: '/pdf-editor/',
    icon: Zap,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    category: 'PDF Editing',
    popular: true,
    supportedFormats: ['.pdf', '.docx', '.pptx'],
    maxSize: '100 MB',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    shortDescription: 'Convert Microsoft Word documents (.docx) into universally readable PDF files in seconds.',
    path: '/word-to-pdf/',
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    category: 'PDF Conversion',
    popular: false,
    supportedFormats: ['.docx'],
    maxSize: '50 MB',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDescription: 'Convert PDF pages into high-resolution JPG images with batch zip downloading.',
    path: '/pdf-to-jpg/',
    icon: FileImage,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    category: 'PDF Conversion',
    popular: false,
    supportedFormats: ['.pdf'],
    maxSize: '100 MB',
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    shortDescription: 'Convert PDF pages into crisp, lossless PNG images with transparent support.',
    path: '/pdf-to-png/',
    icon: FileImage,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    category: 'PDF Conversion',
    popular: false,
    supportedFormats: ['.pdf'],
    maxSize: '100 MB',
  },
  {
    id: 'pdf-to-pptx',
    name: 'PDF to PowerPoint',
    shortDescription: 'Transform PDF pages into editable PowerPoint (.pptx) presentation slides automatically.',
    path: '/pdf-to-pptx/',
    icon: FileText,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    category: 'PDF Conversion',
    popular: false,
    supportedFormats: ['.pdf'],
    maxSize: '50 MB',
  },
  {
    id: 'pptx-to-pdf',
    name: 'PowerPoint to PDF',
    shortDescription: 'Convert PowerPoint slides (.pptx, .ppt) into sharp, readable PDF documents.',
    path: '/pptx-to-pdf/',
    icon: FileText,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    category: 'PDF Conversion',
    popular: false,
    supportedFormats: ['.pptx', '.ppsx'],
    maxSize: '50 MB',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Compress JPEG, PNG, and WebP images up to 80% with live before/after visual preview.',
    path: '/image-compressor/',
    icon: ImageIcon,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    category: 'Image Tools',
    popular: false,
    supportedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSize: '25 MB',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Format, validate, beautify, and minify messy JSON data with syntax error detection.',
    path: '/json-formatter/',
    icon: FileJson,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    category: 'Developer Utilities',
    popular: false,
    supportedFormats: ['.json', 'raw text'],
    maxSize: '10 MB',
  },
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    shortDescription: 'Beautify JavaScript, TypeScript, HTML, CSS, and JSON using Prettier standards.',
    path: '/code-formatter/',
    icon: Code,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400/10',
    category: 'Developer Utilities',
    popular: false,
    supportedFormats: ['.js', '.html', '.css', '.json'],
    maxSize: '5 MB',
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    shortDescription: 'Compute Semester GPA and Cumulative CGPA using standard university grading scales.',
    path: '/cgpa-calculator/',
    icon: Calculator,
    color: 'text-violet-400',
    bgColor: 'bg-violet-400/10',
    category: 'Developer Utilities',
    popular: false,
    supportedFormats: ['Manual entry'],
    maxSize: 'N/A',
  },
];

export const TOOL_CATEGORIES = [
  'All',
  'PDF Management',
  'PDF Conversion',
  'PDF Editing',
  'Office Tools',
  'Image Tools',
  'Developer Utilities'
];

/**
 * Related Tools component for internal linking
 */
export default function RelatedTools({ currentToolId, maxTools = 6, category }) {
  let tools = ALL_TOOLS.filter(t => t.id !== currentToolId);

  if (category) {
    const sameCategory = tools.filter(t => t.category === category);
    const otherCategory = tools.filter(t => t.category !== category);
    tools = [...sameCategory, ...otherCategory];
  }

  tools = tools.slice(0, maxTools);

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>More Privacy-First Tools</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Explore More Free Tools</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            100% browser-based tools with zero server file uploads. Fast, secure, and always free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/40 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`w-11 h-11 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm truncate">
                      {tool.name}
                    </h3>
                    <span className="text-[10px] text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full shrink-0 ml-2">
                      {tool.category.replace('Developer Utilities', 'Dev')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
