import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb component with visual display
 * Schema markup is handled by SEO component via buildBreadcrumbSchema()
 * 
 * @param {Array} items - [{name: "Home", path: "/"}, {name: "PDF Tools", path: "/pdf-editor"}, {name: "Merge PDF"}]
 * The last item should NOT have a path (it's the current page)
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
            {item.path && !isLast ? (
              <Link 
                to={item.path} 
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                {index === 0 && <Home className="w-3.5 h-3.5" />}
                {item.name}
              </Link>
            ) : (
              <span className={isLast ? 'text-white font-medium' : ''}>
                {index === 0 && !item.path && <Home className="w-3.5 h-3.5 inline mr-1" />}
                {item.name}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
