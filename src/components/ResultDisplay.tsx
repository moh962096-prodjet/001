import type { ToolResult } from '../data/toolRegistry';
import { TrendingUp } from 'lucide-react';

export default function ResultDisplay({ result }: { result: ToolResult }) {
  return (
    <div className="card animate-fade-in-up overflow-hidden">
      <div className="border-b border-slate-100 bg-brand-50 px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
          <TrendingUp className="h-4 w-4" />
          {result.title}
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-2xl font-bold text-slate-900">{result.value}</p>
        {result.summary && <p className="mt-2 text-sm text-slate-600">{result.summary}</p>}
        {result.details && result.details.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {result.details.map((d, i) => (
              <div key={i} className="rounded-xl bg-slate-50 px-4 py-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{d.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">{d.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}
