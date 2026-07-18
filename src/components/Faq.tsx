import type { Faq } from '../data/toolRegistry';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Faq({ items, title }: { items: Faq[]; title: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-slate-200">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"
            >
              {item.question}
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open === i ? 'rotate-180' : ''}`} />
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
