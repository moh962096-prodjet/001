import type { ToolResult } from '../data/toolRegistry';

export default function ResultDisplay({ result }: { result: ToolResult }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">{result.title}</h3>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-brand-700">{result.value}</p>
      {result.summary && <p className="mt-2 text-sm text-slate-600">{result.summary}</p>}
      {result.details && result.details.length > 0 && (
        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4">
          {result.details.map((d, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm">
              <dt className="shrink-0 font-medium text-slate-500">{d.label}</dt>
              <dd className="whitespace-pre-wrap break-words text-right font-semibold text-slate-800">{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
