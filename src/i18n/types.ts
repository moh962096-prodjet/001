import type { Locale } from './config';

/**
 * Base shape for all translation files.
 * Every locale must implement this interface.
 * Tool and category translations are keyed by their slug / id.
 */
export interface Translation {
  meta: {
    siteName: string;
    title: string;
    description: string;
    keywords: string;
  };

  nav: {
    categories: string;
    search: string;
    searchPlaceholder: string;
    searchResultsLabel: string;
    language: string;
  };

  home: {
    badge: (n: number) => string;
    heroTitle: string;
    heroTitleAccent: string;
    heroSubtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    noResults: string;
    browseTitle: string;
    browseSubtitle: string;
    popularTitle: string;
    recentlyAddedTitle: string;
    faqTitle: string;
    toolCount: (count: number) => string;
  };

  category: {
    notFoundTitle: string;
    notFoundMessage: string;
    otherCategoriesTitle: string;
    emptyMessage: string;
  };

  tool: {
    calculate: string;
    reset: string;
    aboutTitle: string;
    faqTitle: string;
    relatedTools: string;
    share: string;
    advertisement: string;
    errorRequired: string;
    errorCalculation: string;
  };

  footer: {
    description: string;
    categoriesTitle: string;
    moreTitle: string;
    companyTitle: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    copyright: string;
  };

  newsletter: {
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    success: string;
  };

  faq: {
    defaultTitle: string;
  };

  share: {
    label: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    copyLink: string;
    copied: string;
  };

  notFound: {
    title: string;
    message: string;
    backHome: string;
  };

  cookieConsent: {
    title: string;
    message: string;
    accept: string;
    reject: string;
    customize: string;
    learnMore: string;
    necessary: string;
    necessaryDesc: string;
    analytics: string;
    analyticsDesc: string;
    advertising: string;
    advertisingDesc: string;
    save: string;
  };

  staticPages: {
    aboutTitle: string;
    aboutBody: string[];
    contactTitle: string;
    contactBody: string[];
    privacyTitle: string;
    privacyBody: string[];
    termsTitle: string;
    termsBody: string[];
    disclaimerTitle: string;
    disclaimerBody: string[];
  };

  /** Localized category names keyed by category id */
  categories: Record<string, { name: string; description: string }>;

  /** Localized tool metadata keyed by tool slug */
  tools: Record<string, {
    title: string;
    description: string;
    metaDescription: string;
    keywords: string[];
    explanation: string;
    faqs: { question: string; answer: string }[];
  }>;
}

export type TranslationLoader = () => Promise<Translation>;

export const translationLoaders: Record<Locale, TranslationLoader> = {
  en: () => import('./locales/en').then((m) => m.default),
  es: () => import('./locales/es').then((m) => m.default),
  fr: () => import('./locales/fr').then((m) => m.default),
  de: () => import('./locales/de').then((m) => m.default),
  ar: () => import('./locales/ar').then((m) => m.default),
};
