import { Link } from 'react-router-dom';
import type { Tool } from '../data/toolRegistry';
import { categoryMap } from '../data/categories';
import type { Locale } from '../i18n/config';
import { localizePath } from '../utils/router';

export default function ToolCard({ tool, locale }: { tool: Tool; locale: Locale }) {
  const cat = categoryMap[tool.category];
  return (
    <Link
      to={localizePath(`/tools/${tool.slug}`, locale)}
      className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md"
    >
      {cat && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <cat.icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-brand-600">{tool.title}</h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{tool.description}</p>
      </div>
    </Link>
  );
}
