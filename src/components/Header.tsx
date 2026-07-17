import { useState, useEffect } from 'react';
import { Link, localizePath } from '../utils/router';
import { categories } from '../data/categories';
import { searchTools, getAllTools } from '../data/toolRegistry';
import { useI18n, useLocalizedCategory } from '../i18n';
import LanguageSwitcher from './LanguageSwitcher';
import { Calculator, Menu, X, Search, ChevronDown } from 'lucide-react';
import type { Category } from '../data/categories';
import type { Locale } from '../i18n/config';

function CategoryLink({ category, locale, onClick }: { category: Category; locale: Locale; onClick?: () => void }) {
  const localizedCat = useLocalizedCategory(category);
  return (
    <Link
      to={localizePath(`/category/${category.id}`, locale)}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50"
    >
      {localizedCat.name}
    </Link>
  );
}

export default function Header({ onNavigate }: { onNavigate?: () => void }) {
  const { locale, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(getAllTools().slice(0, 6));

  useEffect(() => {
    if (query.trim()) {
      setResults(searchTools(query).slice(0, 6));
    } else {
      setResults(getAllTools().slice(0, 6));
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      window.location.hash = localizePath(`/tools/${results[0].slug}`, locale);
      setQuery('');
      setMobileOpen(false);
      onNavigate?.();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to={localizePath('/', locale)} className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">ToolVerse</span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="relative hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                aria-label={t.nav.search}
              />
            </div>
            {query && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {results.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={localizePath(`/tools/${tool.slug}`, locale)}
                    onClick={() => setQuery('')}
                    className="block px-4 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50"
                  >
                    {tool.title}
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-brand-600">
                {t.nav.categories}
                <ChevronDown className="h-4 w-4" />
              </button>
              {catOpen && (
                <div className="absolute right-0 top-full w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  {categories.map((c) => (
                    <CategoryLink key={c.id} category={c} locale={locale} />
                  ))}
                </div>
              )}
            </div>

            <LanguageSwitcher />
          </nav>

          <button
            className="rounded-xl p-2 text-slate-700 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm"
                aria-label={t.nav.search}
              />
            </form>
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{t.nav.categories}</p>
              {categories.map((c) => (
                <CategoryLink
                  key={c.id}
                  category={c}
                  locale={locale}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
