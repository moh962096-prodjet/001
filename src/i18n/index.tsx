import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  type Locale,
  DEFAULT_LOCALE,
  isLocale,
  detectBrowserLocale,
  getDir,
  LOCALES,
} from './config';
import type { Translation } from './types';
import { translationLoaders } from './types';
import type { Tool } from '../data/toolRegistry';
import type { Category } from '../data/categories';

interface I18nContextValue {
  locale: Locale;
  t: Translation;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
  loading: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'toolverse-locale';

function getStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    // localStorage may not be available
  }
  return null;
}

function storeLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [t, setT] = useState<Translation | null>(null);

  // Initial locale resolution: stored > browser > default
  useEffect(() => {
    const stored = getStoredLocale();
    const initial = stored ?? detectBrowserLocale();
    setLocaleState(initial);
  }, []);

  // Load translation when locale changes
  useEffect(() => {
    let cancelled = false;
    translationLoaders[locale]().then((translation) => {
      if (!cancelled) setT(translation);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    storeLocale(newLocale);
  }, []);

  const dir = getDir(locale);

  // Set <html lang> and <dir> attributes
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, t: t as Translation, dir, setLocale, loading: t === null }),
    [locale, t, dir, setLocale],
  );

  if (!t) {
    // Render nothing while loading to avoid flash of untranslated content
    return null;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

/**
 * Returns a localized category: original category object with
 * name and description overridden from translations if available.
 */
export function useLocalizedCategory(category: Category): Category {
  const { t } = useI18n();
  const tr = t.categories[category.id];
  if (!tr) return category;
  return { ...category, name: tr.name, description: tr.description };
}

/**
 * Returns a localized tool: original tool object with
 * title, description, metaDescription, keywords, explanation, and faqs
 * overridden from translations if available.
 * Calculation logic, fields, and custom components are preserved.
 */
export function useLocalizedTool(tool: Tool): Tool {
  const { t } = useI18n();
  const tr = t.tools[tool.slug];
  if (!tr) return tool;
  return {
    ...tool,
    title: tr.title,
    description: tr.description,
    metaDescription: tr.metaDescription,
    keywords: tr.keywords,
    explanation: tr.explanation,
    faqs: tr.faqs,
  };
}

export { LOCALES };
