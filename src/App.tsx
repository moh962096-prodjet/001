import './data/initTools';
import { useRouter, Link, parsePath } from './utils/router';
import { getTool } from './data/toolRegistry';
import { categoryMap } from './data/categories';
import { usePageMeta } from './utils/seo';
import { I18nProvider, useI18n } from './i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ToolPage from './components/ToolPage';
import { useEffect } from 'react';
import { isLocale, detectBrowserLocale } from './i18n/config';
import type { Locale } from './i18n/config';

function AppContent() {
  const { route, setRoute } = useRouter();
  const { locale, setLocale } = useI18n();

  // Redirect bare paths (without locale prefix) to the detected locale
  useEffect(() => {
    const path = window.location.pathname || '/';
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0 || !isLocale(segments[0])) {
      // No locale prefix — redirect to detected locale
      const detected = (getStoredLocale() ?? detectBrowserLocale()) as Locale;
      const rest = segments.length > 0 ? '/' + segments.join('/') : '';
      const newPath = `/${detected}${rest}`;
      window.history.replaceState(null, '', newPath);
      setLocale(detected);
      setRoute(parsePath());
    } else if (segments[0] !== locale) {
      // Sync locale from URL
      setLocale(segments[0] as Locale);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep URL locale in sync when locale changes (e.g. language switcher)
  useEffect(() => {
    const path = window.location.pathname || '/';
    const segments = path.split('/').filter(Boolean);
    const currentLocaleInUrl = segments.length > 0 && isLocale(segments[0]) ? segments[0] : null;

    if (currentLocaleInUrl !== locale) {
      const rest = segments.length > 0 && isLocale(segments[0])
        ? '/' + segments.slice(1).join('/')
        : segments.length > 0
          ? '/' + segments.join('/')
          : '';
      const newPath = `/${locale}${rest}`;
      window.history.replaceState(null, '', newPath);
      setRoute(parsePath());
    }
  }, [locale]);

  let content: React.ReactNode;

  if (route.pathWithoutLocale === '/' || route.pathWithoutLocale === '') {
    content = <HomePage />;
  } else if (route.pathWithoutLocale.startsWith('/tools/')) {
    const slug = route.pathWithoutLocale.replace('/tools/', '');
    const tool = getTool(slug);
    if (tool) {
      content = <ToolPage tool={tool} />;
    } else {
      content = <NotFound />;
    }
  } else if (route.pathWithoutLocale.startsWith('/category/')) {
    const categoryId = route.pathWithoutLocale.replace('/category/', '');
    if (categoryMap[categoryId]) {
      content = <CategoryPage categoryId={categoryId} />;
    } else {
      content = <NotFound />;
    }
  } else if (['/about', '/contact', '/privacy', '/terms', '/disclaimer'].includes(route.pathWithoutLocale)) {
    content = <StaticPage page={route.pathWithoutLocale} />;
  } else {
    content = <NotFound />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
}

const STORAGE_KEY = 'toolverse-locale';

function getStoredLocale(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function NotFound() {
  const { t } = useI18n();
  usePageMeta(t.notFound.title, t.notFound.message, '/404');
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-6xl font-extrabold text-brand-600">404</h1>
      <p className="mt-4 text-lg text-slate-600">{t.notFound.message}</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        {t.notFound.backHome}
      </Link>
    </div>
  );
}

function StaticPage({ page }: { page: string }) {
  const { t } = useI18n();
  const pageKey = page.slice(1) as 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer';
  const title = t.staticPages[`${pageKey}Title` as keyof typeof t.staticPages] as string;
  const body = t.staticPages[`${pageKey}Body` as keyof typeof t.staticPages] as string[];

  usePageMeta(`${title} — ${t.meta.siteName}`, title, page);

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-slate-900">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-slate-600">
          {body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
