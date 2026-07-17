export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ar';

export interface LocaleConfig {
  code: Locale;
  label: string;
  englishLabel: string;
  dir: 'ltr' | 'rtl';
  hreflang: string;
}

export const LOCALES: LocaleConfig[] = [
  { code: 'en', label: 'English', englishLabel: 'English', dir: 'ltr', hreflang: 'en' },
  { code: 'es', label: 'Español', englishLabel: 'Spanish', dir: 'ltr', hreflang: 'es' },
  { code: 'fr', label: 'Français', englishLabel: 'French', dir: 'ltr', hreflang: 'fr' },
  { code: 'de', label: 'Deutsch', englishLabel: 'German', dir: 'ltr', hreflang: 'de' },
  { code: 'ar', label: 'العربية', englishLabel: 'Arabic', dir: 'rtl', hreflang: 'ar' },
];

export const DEFAULT_LOCALE: Locale = 'en';

export const SUPPORTED_LOCALES: Locale[] = LOCALES.map((l) => l.code);

export const LOCALE_MAP: Record<string, LocaleConfig> = Object.fromEntries(
  LOCALES.map((l) => [l.code, l]),
);

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function getLocaleConfig(locale: Locale): LocaleConfig {
  return LOCALE_MAP[locale] ?? LOCALE_MAP[DEFAULT_LOCALE];
}

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return getLocaleConfig(locale).dir;
}

/**
 * Detect the user's preferred locale from the browser.
 * Falls back to DEFAULT_LOCALE if no match is found.
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const languages = navigator.languages ?? [navigator.language];
  for (const lang of languages) {
    const primary = lang.split('-')[0].toLowerCase();
    if (isLocale(primary)) return primary;
  }
  return DEFAULT_LOCALE;
}
