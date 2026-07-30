import { Link } from 'react-router-dom';
import { ArrowRight, FileText, FileJson, Image as ImageIcon, Calculator, Code, Merge, Scissors, FileDown, Zap, FileImage } from 'lucide-react';

/**
 * All available tools with metadata for internal linking
 */
export const ALL_TOOLS = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    shortDescription: 'Combine multiple PDFs into one document.',
    path: '/merge-pdf',
    icon: Merge,
    color: 'text-rose-400',
    bgColor: 'bg-rose-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    shortDescription: 'Reduce PDF file size without losing quality.',
    path: '/compress-pdf',
    icon: FileDown,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    shortDescription: 'Extract pages or split PDFs into multiple files.',
    path: '/split-pdf',
    icon: Scissors,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    shortDescription: 'Convert PDF pages to high-quality images.',
    path: '/pdf-to-jpg',
    icon: FileImage,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    shortDescription: 'Convert PDF pages to high-quality PNG images.',
    path: '/pdf-to-png',
    icon: FileImage,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    shortDescription: 'Convert PDF to editable Word document.',
    path: '/pdf-to-word',
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF',
    shortDescription: 'Convert Word document to PDF.',
    path: '/word-to-pdf',
    icon: FileText,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'pdf-to-pptx',
    name: 'PDF to PowerPoint',
    shortDescription: 'Smart slide layout from PDF structure.',
    path: '/pdf-to-pptx',
    icon: FileText,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'pptx-to-pdf',
    name: 'PowerPoint to PDF',
    shortDescription: 'Convert PowerPoint presentation to PDF.',
    path: '/pptx-to-pdf',
    icon: FileText,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'pdf-editor',
    name: 'PDF Editor',
    shortDescription: 'Full-featured PDF editor with all conversion tools.',
    path: '/pdf-editor',
    icon: Zap,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    category: 'PDF Tools',
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    shortDescription: 'Format, validate, and minify JSON data.',
    path: '/json-formatter',
    icon: FileJson,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    category: 'Developer Tools',
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    shortDescription: 'Compress images without losing visual quality.',
    path: '/image-compressor',
    icon: ImageIcon,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    category: 'Image Tools',
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    shortDescription: 'Calculate your CGPA with the BD grading system.',
    path: '/cgpa-calculator',
    icon: Calculator,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    category: 'Student Tools',
  },
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    shortDescription: 'Format JS, HTML, CSS, and JSON with Prettier.',
    path: '/code-formatter',
    icon: Code,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    category: 'Developer Tools',
  },
];

/**
 * Related Tools component for internal linking
 * Displays a grid of related tool cards at the bottom of each page
 * 
 * @param {string} currentToolId - ID of the current tool (to exclude from list)
 * @param {number} maxTools - Maximum tools to show (default: 6)
 * @param {string} category - Optional: prioritize tools from this category
 */
export default function RelatedTools({ currentToolId, maxTools = 6, category }) {
  // Filter out current tool and prioritize same category
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
          <h2 className="text-3xl font-bold tracking-tight">Explore More Tools</h2>
          <p className="text-muted-foreground">Discover other free online tools from PdfNest.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group flex items-start gap-4 p-5 rounded-xl glass-card"
              >
                <div className={`w-10 h-10 rounded-lg ${tool.bgColor} ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors text-sm">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
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
