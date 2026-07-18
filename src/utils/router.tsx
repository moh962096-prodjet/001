import { useEffect, useState, useCallback } from 'react';
import { type Locale, DEFAULT_LOCALE, isLocale, SUPPORTED_LOCALES } from '../i18n/config';

export interface Route {
  /** Full path including locale prefix, e.g. /en/tools/bmi-calculator */
  path: string;
  /** Path without locale prefix, e.g. /tools/bmi-calculator */
  pathWithoutLocale: string;
  locale: Locale;
  params: Record<string, string>;
}

export function parsePath(): Route {
  const fullPath = window.location.pathname || '/';
  const queryString = window.location.search.replace(/^\?/, '');
  const params: Record<string, string> = {};
  if (queryString) {
    new URLSearchParams(queryString).forEach((v, k) => {
      params[k] = v;
    });
  }

  const path = fullPath || '/';

  // Extract locale from path: /en/..., /es/..., etc.
  const segments = path.split('/').filter(Boolean);
  let locale: Locale = DEFAULT_LOCALE;
  let pathWithoutLocale = path;

  if (segments.length > 0 && isLocale(segments[0])) {
    locale = segments[0] as Locale;
    pathWithoutLocale = '/' + segments.slice(1).join('/');
    if (pathWithoutLocale === '/') pathWithoutLocale = '/';
  }

  return { path, pathWithoutLocale, locale, params };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parsePath());

  useEffect(() => {
    const onChange = () => {
      setRoute(parsePath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, '', to);
    setRoute(parsePath());
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate, setRoute };
}

/**
 * Build a localized path. If the path already starts with a locale prefix,
 * it is returned as-is. Otherwise the current locale is prepended.
 */
export function useLocalizedNavigate() {
  const [route] = useState<Route>(() => parsePath());

  const navigateLocalized = useCallback(
    (to: string, locale: Locale = route.locale) => {
      // Strip leading slash for consistent joining
      const cleanPath = to.startsWith('/') ? to : `/${to}`;
      // Check if path already has a locale prefix
      const segments = cleanPath.split('/').filter(Boolean);
      let target: string;
      if (segments.length > 0 && isLocale(segments[0])) {
        target = cleanPath;
      } else {
        target = `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
      }
      window.history.pushState(null, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    [route.locale],
  );

  return navigateLocalized;
}

/**
 * Build a localized href for Link components.
 * Ensures paths are prefixed with the current locale.
 */
export function localizePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (onClick) onClick();
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        window.history.pushState(null, '', to);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE };
