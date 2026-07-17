import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n';

export interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq({ items, title }: { items: FaqItem[]; title?: string }) {
  const { t } = useI18n();
  const resolvedTitle = title ?? t.faq.defaultTitle;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{resolvedTitle}</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-medium text-slate-900">{item.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition ${open === i ? 'rotate-180' : ''}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
