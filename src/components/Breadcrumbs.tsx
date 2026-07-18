import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {item.to ? (
              <Link to={item.to} className="hover:text-brand-600">{item.label}</Link>
            ) : (
              <span className="text-slate-700">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
