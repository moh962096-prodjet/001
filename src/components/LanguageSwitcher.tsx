import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LOCALES } from '../i18n/config';
import type { Locale } from '../i18n/config';
import { useI18n } from '../i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const currentLocale = LOCALES.find((l) => l.code === locale);

  const selectLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setOpen(false);

    // Update URL to reflect new locale
    const hash = window.location.hash.replace(/^#/, '') || '/';
    const segments = hash.split('/').filter(Boolean);
    let rest = '/';
    if (segments.length > 0) {
      const startIdx = LOCALES.some((l) => l.code === segments[0]) ? 1 : 0;
      rest = segments.slice(startIdx).join('/');
      rest = rest ? '/' + rest : '/';
    }
    window.location.hash = `/${newLocale}${rest === '/' ? '' : rest}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-brand-600"
        aria-label={t.nav.language}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLocale?.label}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              onClick={() => selectLocale(loc.code)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-brand-50 ${
                loc.code === locale ? 'font-semibold text-brand-700' : 'text-slate-700'
              }`}
            >
              {loc.label}
              {loc.code === locale && (
                <span className="text-xs text-brand-600">●</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
