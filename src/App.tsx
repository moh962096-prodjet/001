import ArticlePage from "./pages/ArticlePage";
import BlogPage from "./pages/BlogPage";
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n';
import { initTools } from './data/initTools';
import { getAllTools, getToolBySlug, getToolsByCategory, searchTools } from './data/toolRegistry';
import { categories, categoryMap } from './data/categories';
import { locales, defaultLocale, type Locale } from './i18n/config';
import { getLocaleFromPath, localizePath } from './utils/router';
import ToolPage from './components/ToolPage';
import ToolCard from './components/ToolCard';
import { Search, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';

initTools();

function Header() {
  const { locale, setLocale, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTools>>([]);
  const navigate = useNavigate();

  const onSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      setSearchResults(searchTools(q).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  };

  const goToSearch = () => {
    if (searchQuery.trim()) {
      navigate(localizePath(`/search?q=${encodeURIComponent(searchQuery)}`, locale));
      setSearchResults([]);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to={localizePath('/', locale)} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">T</div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">ToolVerse</span>
        </Link>

        <div className="relative hidden flex-1 max-w-md md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
            placeholder={t.nav.searchPlaceholder}
            className="input-field !py-2 pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          {searchResults.length > 0 && (
            <div className="absolute mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {searchResults.map((tool) => (
                <Link
                  key={tool.slug}
                  to={localizePath(`/tools/${tool.slug}`, locale)}
                  onClick={() => { setSearchResults([]); setSearchQuery(''); }}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <span className="font-semibold text-slate-800">{tool.title}</span>
                  <span className="ml-2 text-xs text-slate-400">{tool.description}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Globe className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-slate-400" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-8 pr-8 text-sm font-medium text-slate-700"
            >
              {locales.map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
            placeholder={t.nav.searchPlaceholder}
            className="input-field !py-2 pl-9"
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link key={cat.slug} to={localizePath(`/category/${cat.slug}`, locale)} onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { locale } = useI18n();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">T</div>
              <span className="text-lg font-extrabold text-slate-900">ToolVerse</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">Free online calculators and developer tools. No sign-up required.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Categories</h4>
            <ul className="mt-2 space-y-1">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link to={localizePath(`/category/${cat.slug}`, locale)} className="text-sm text-slate-500 hover:text-brand-600">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">More Categories</h4>
            <ul className="mt-2 space-y-1">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link to={localizePath(`/category/${cat.slug}`, locale)} className="text-sm text-slate-500 hover:text-brand-600">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">About</h4>
            <p className="mt-2 text-sm text-slate-500">ToolVerse is a collection of free, browser-based tools for everyday tasks, development, and calculations.</p>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} ToolVerse. All tools run in your browser — your data never leaves your device.
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  const { locale, t } = useI18n();
  const allTools = getAllTools();
  const newTools = allTools.filter((tool) => tool.recentlyAdded);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container-page text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{t.home.heroTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">{t.home.heroSubtitle}</p>
          <div className="mx-auto mt-8 max-w-lg">
            <Link to={localizePath(`/search?q=`, locale)} className="btn-primary w-full justify-center text-base">
              <Search className="h-5 w-5" /> {t.nav.search}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-2xl font-bold text-slate-900">{t.home.browseCategories}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.slug} to={localizePath(`/category/${cat.slug}`, locale)}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <cat.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600">{cat.name}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {newTools.length > 0 && (
        <section className="container-page pb-12">
          <h2 className="text-2xl font-bold text-slate-900">{t.home.recentlyAdded}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function CategoryPage() {
  const { category } = useParams();
  const { locale, t } = useI18n();
  const cat = category ? categoryMap[category] : undefined;
  const tools = category ? getToolsByCategory(category) : [];

  if (!cat) return <Navigate to={localizePath('/', locale)} replace />;

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <cat.icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{cat.name}</h1>
          <p className="text-sm text-slate-500">{cat.description}</p>
        </div>
      </div>
      {tools.length === 0 ? (
        <p className="text-slate-500">{t.category.noTools}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function ToolRoute() {
  const { slug } = useParams();
  const { locale } = useI18n();
  const tool = slug ? getToolBySlug(slug) : undefined;
  if (!tool) return <Navigate to={localizePath('/', locale)} replace />;
  return <ToolPage tool={tool} />;
}

function SearchPage() {
  const { locale, t } = useI18n();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('q') || '';
  const results = query ? searchTools(query) : [];

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-extrabold text-slate-900">{t.search.results}</h1>
      <p className="mt-1 text-sm text-slate-500">"{query}" — {results.length} result{results.length !== 1 ? 's' : ''}</p>
      {results.length === 0 ? (
        <p className="mt-6 text-slate-500">{t.search.noResults}</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotFoundPage() {
  const { locale, t } = useI18n();
  return (
    <div className="container-page py-16 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900">{t.notFound.title}</h1>
      <p className="mt-3 text-slate-500">{t.notFound.description}</p>
      <Link to={localizePath('/', locale)} className="btn-primary mt-6 inline-flex">{t.notFound.backHome}</Link>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const { locale, setLocale } = useI18n();

  useEffect(() => {
    const detected = getLocaleFromPath(location.pathname);
    setLocale(detected);
  }, [location.pathname, setLocale]);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/tools/:slug" element={<ToolRoute />} />
          <Route path="/search" element={<SearchPage />} />
<Route path="/blog" element={<div className="container-page py-10"><h1 className="text-4xl font-bold">Blog</h1></div>} />

<Route path="/blog/:slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* Locale-prefixed routes */}
          {locales.filter((l) => l !== defaultLocale).map((l) => (
            <Route key={l} path={`/${l}`} element={<HomePage />} />
          ))}
          {locales.filter((l) => l !== defaultLocale).map((l) => (
            <Route key={`${l}-cat`} path={`/${l}/category/:category`} element={<CategoryPage />} />
          ))}
          {locales.filter((l) => l !== defaultLocale).map((l) => (
            <Route key={`${l}-tool`} path={`/${l}/tools/:slug`} element={<ToolRoute />} />
          ))}
          {locales.filter((l) => l !== defaultLocale).map((l) => (
            <Route key={`${l}-search`} path={`/${l}/search`} element={<SearchPage />} />
          ))}
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AppRoutes />
      </I18nProvider>
    </BrowserRouter>
  );
}
