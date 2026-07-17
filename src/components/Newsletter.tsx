import { useState } from 'react';
import { Check } from 'lucide-react';
import { useI18n } from '../i18n';

export default function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="mt-16">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.newsletter.title}</h2>
          <p className="mt-2 text-brand-100">
            {t.newsletter.subtitle}
          </p>
          {submitted ? (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-white backdrop-blur">
              <Check className="h-5 w-5" />
              {t.newsletter.success}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.placeholder}
                className="flex-1 rounded-xl border-0 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={t.newsletter.placeholder}
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50 active:scale-[0.98]"
              >
                {t.newsletter.button}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
