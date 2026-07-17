import { Link, localizePath } from '../utils/router';
import type { Tool } from '../data/toolRegistry';
import { categoryMap } from '../data/categories';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '../i18n/config';

export default function ToolCard({ tool, locale = 'en' }: { tool: Tool; locale?: Locale }) {
  const cat = categoryMap[tool.category];
  return (
    <Link
      to={localizePath(`/tools/${tool.slug}`, locale)}
      className="card group flex flex-col p-5"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
          {cat && <cat.icon className="h-5 w-5" />}
        </div>
        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500" />
      </div>
      <h3 className="font-semibold text-slate-900 transition group-hover:text-brand-700">{tool.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{tool.description}</p>
    </Link>
  );
}
