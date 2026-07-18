import type { Locale } from '../i18n/config';

export function localizePath(path: string, locale: Locale): string {
  if (locale === 'en') return path;
  return `/${locale}${path}`;
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first === 'es' || first === 'fr' || first === 'de') return first;
  return 'en';
}
