import { useState } from 'react';
import { Link, localizePath } from '../utils/router';
import { categories } from '../data/categories';
import { getAllTools, getPopularTools, getRecentlyAddedTools, searchTools, type Tool } from '../data/toolRegistry';
import { useHomeSeo } from '../utils/seo';
import { useI18n, useLocalizedCategory, useLocalizedTool } from '../i18n';
import ToolCard from '../components/ToolCard';
import Newsletter from '../components/Newsletter';
import Faq from '../components/Faq';
import { Search, ArrowRight, Sparkles, Clock, TrendingUp } from 'lucide-react';
import type { Category } from '../data/categories';
import type { Tool as ToolType } from '../data/toolRegistry';
import type { Locale } from '../i18n/config';

const homeFaqs = [
  { question: 'Are ToolVerse tools free to use?', answer: 'Yes. Every tool on ToolVerse is completely free. There are no hidden fees, signups, or usage limits. You can use all calculators and tools as much as you like.' },
  { question: 'Do I need to install any software?', answer: 'No. All tools run directly in your browser. There is nothing to download or install — just visit the tool page and start using it immediately.' },
  { question: 'Is my data safe when using these tools?', answer: 'Yes. All calculations and file processing happen locally in your browser. Your data is never uploaded to a server, so it stays completely private.' },
  { question: 'Can I use these tools on my phone?', answer: 'Absolutely. ToolVerse is fully responsive and works on mobile phones, tablets, and desktop computers. The interface adapts to your screen size automatically.' },
  { question: 'How often are new tools added?', answer: 'We add new tools regularly. Subscribe to our newsletter to get notified when new calculators and tools are available.' },
];

function CategoryCard({ category, toolCount }: { category: Category; toolCount: number }) {
  const { locale, t } = useI18n();
  const localeTyped = locale as Locale;
  const localizedCat = useLocalizedCategory(category);
  return (
    <Link
      to={localizePath(`/category/${category.id}`, localeTyped)}
      className="card group flex flex-col items-center p-6 text-center"
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <category.icon className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-slate-900 transition group-hover:text-brand-700">{localizedCat.name}</h3>
      <p className="mt-1 text-xs text-slate-400">{t.home.toolCount(toolCount)}</p>
    </Link>
  );
}

function PopularToolCard({ tool }: { tool: ToolType }) {
  const { locale } = useI18n();
  const localeTyped = locale as Locale;
  const localizedTool = useLocalizedTool(tool);
  return <ToolCard tool={localizedTool} locale={localeTyped} />;
}

function SearchResultLink({ tool, locale }: { tool: ToolType; locale: Locale }) {
  const localizedTool = useLocalizedTool(tool);
  return (
    <Link
      to={localizePath(`/tools/${tool.slug}`, locale)}
      className="flex items-center justify-between px-4 py-3 text-sm text-slate-700 transition hover:bg-brand-50"
    >
      {localizedTool.title}
      <ArrowRight className="h-4 w-4 text-slate-300" />
    </Link>
  );
}

export default function HomePage() {
  const { locale, t } = useI18n();
  useHomeSeo();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[] | null>(null);
  const allTools = getAllTools();
  const popular = getPopularTools();
  const recent = getRecentlyAddedTools();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const results = searchTools(query);
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute right-1/4 top-20 h-96 w-96 translate-x-1/2 rounded-full bg-brand-100/40 blur-3xl" />
        </div>
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t.home.badge(allTools.length)}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {t.home.heroTitle}<br />
              <span className="text-brand-600">{t.home.heroTitleAccent}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
              {t.home.heroSubtitle}
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-xl">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!e.target.value.trim()) setSearchResults(null);
                  }}
                  placeholder={t.home.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-base shadow-lg shadow-brand-900/5 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  aria-label={t.nav.search}
                />
                <button type="submit" className="btn-primary absolute right-2 px-5 py-2.5">
                  {t.home.searchButton}
                </button>
              </div>
            </form>

            {searchResults && (
              <div className="mx-auto mt-4 max-w-xl text-left">
                {searchResults.length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {searchResults.map((tool) => (
                      <SearchResultLink key={tool.slug} tool={tool} locale={locale} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">{t.home.noResults}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t.home.browseTitle}</h2>
          <p className="mt-2 text-slate-500">{t.home.browseSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat) => {
            const count = allTools.filter((tool) => tool.category === cat.id).length;
            return <CategoryCard key={cat.id} category={cat} toolCount={count} />;
          })}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mb-10 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-brand-600" />
            <h2 className="text-3xl font-bold text-slate-900">{t.home.popularTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((tool) => (
              <PopularToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      {recent.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-10 flex items-center gap-2">
            <Clock className="h-6 w-6 text-brand-600" />
            <h2 className="text-3xl font-bold text-slate-900">{t.home.recentlyAddedTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((tool) => (
              <PopularToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="container-page">
          <Faq items={homeFaqs} title={t.home.faqTitle} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page pb-16">
        <Newsletter />
      </section>
    </div>
  );
}
