import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { defaultLocale, type Locale } from './config';
import type { Tool, Faq } from '../data/toolRegistry';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations.en;
}

const translations = {
  en: {
    site: { name: 'ToolVerse', tagline: 'Free online calculators & developer tools' },
    nav: { home: 'Home', categories: 'Categories', search: 'Search', searchPlaceholder: 'Search 65+ tools...' },
    tool: {
      calculate: 'Calculate',
      reset: 'Reset',
      aboutTitle: 'About',
      faqTitle: 'FAQ',
      relatedTools: 'Related Tools',
      advertisement: 'Advertisement',
      errorRequired: 'Please fill in all required fields.',
      errorCalculation: 'An error occurred during calculation.',
    },
    home: {
      heroTitle: 'All your tools in one place',
      heroSubtitle: '65+ free calculators, converters, and developer tools. No sign-up, no ads in your way, just tools that work.',
      searchPlaceholder: 'Search for a tool...',
      browseCategories: 'Browse Categories',
      popularTools: 'Popular Tools',
      recentlyAdded: 'Recently Added',
    },
    category: { tools: 'Tools', noTools: 'No tools in this category yet.' },
    search: { results: 'Search Results', noResults: 'No tools found. Try a different search.', query: 'Search' },
    notFound: { title: 'Page Not Found', description: 'The page you are looking for does not exist.', backHome: 'Back to Home' },
  },
  footer: {
  about: 'About',
  categories: 'Categories',
  legal: 'Legal',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  contact: 'Contact',
  copyright: 'All rights reserved.'
},
  es: {
    site: { name: 'ToolVerse', tagline: 'Calculadoras y herramientas para desarrolladores gratis' },
    nav: { home: 'Inicio', categories: 'Categorías', search: 'Buscar', searchPlaceholder: 'Buscar 65+ herramientas...' },
    tool: {
      calculate: 'Calcular',
      reset: 'Reiniciar',
      aboutTitle: 'Acerca de',
      faqTitle: 'Preguntas frecuentes',
      relatedTools: 'Herramientas relacionadas',
      advertisement: 'Publicidad',
      errorRequired: 'Por favor complete todos los campos requeridos.',
      errorCalculation: 'Ocurrió un error durante el cálculo.',
    },
    home: {
      heroTitle: 'Todas tus herramientas en un solo lugar',
      heroSubtitle: '65+ calculadoras, conversores y herramientas para desarrolladores gratis.',
      searchPlaceholder: 'Buscar una herramienta...',
      browseCategories: 'Explorar categorías',
      popularTools: 'Herramientas populares',
      recentlyAdded: 'Añadido recientemente',
    },
    category: { tools: 'Herramientas', noTools: 'No hay herramientas en esta categoría.' },
    search: { results: 'Resultados de búsqueda', noResults: 'No se encontraron herramientas.', query: 'Buscar' },
    notFound: { title: 'Página no encontrada', description: 'La página que buscas no existe.', backHome: 'Volver al inicio' },
  },
  footer: {
  about: 'About',
  categories: 'Categories',
  legal: 'Legal',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  contact: 'Contact',
  copyright: 'All rights reserved.'
},
  fr: {
    site: { name: 'ToolVerse', tagline: 'Calculatrices et outils de développement gratuits' },
    nav: { home: 'Accueil', categories: 'Catégories', search: 'Rechercher', searchPlaceholder: 'Rechercher 65+ outils...' },
    tool: {
      calculate: 'Calculer',
      reset: 'Réinitialiser',
      aboutTitle: 'À propos de',
      faqTitle: 'FAQ',
      relatedTools: 'Outils associés',
      advertisement: 'Publicité',
      errorRequired: 'Veuillez remplir tous les champs requis.',
      errorCalculation: 'Une erreur est survenue pendant le calcul.',
    },
    home: {
      heroTitle: 'Tous vos outils au même endroit',
      heroSubtitle: '65+ calculatrices, convertisseurs et outils de développement gratuits.',
      searchPlaceholder: 'Rechercher un outil...',
      browseCategories: 'Parcourir les catégories',
      popularTools: 'Outils populaires',
      recentlyAdded: 'Récemment ajouté',
    },
    category: { tools: 'Outils', noTools: "Aucun outil dans cette catégorie." },
    search: { results: 'Résultats de recherche', noResults: 'Aucun outil trouvé.', query: 'Rechercher' },
    notFound: { title: 'Page introuvable', description: "La page que vous cherchez n'existe pas.", backHome: "Retour à l'accueil" },
  },
  footer: {
  about: 'About',
  categories: 'Categories',
  legal: 'Legal',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  contact: 'Contact',
  copyright: 'All rights reserved.'
},
  de: {
    site: { name: 'ToolVerse', tagline: 'Kostenlose Taschenrechner und Entwicklertools' },
    nav: { home: 'Startseite', categories: 'Kategorien', search: 'Suche', searchPlaceholder: '65+ Tools durchsuchen...' },
    tool: {
      calculate: 'Berechnen',
      reset: 'Zurücksetzen',
      aboutTitle: 'Über',
      faqTitle: 'FAQ',
      relatedTools: 'Verwandte Tools',
      advertisement: 'Werbung',
      errorRequired: 'Bitte füllen Sie alle Pflichtfelder aus.',
      errorCalculation: 'Bei der Berechnung ist ein Fehler aufgetreten.',
    },
    home: {
      heroTitle: 'Alle Ihre Tools an einem Ort',
      heroSubtitle: '65+ kostenlose Taschenrechner, Konverter und Entwicklertools.',
      searchPlaceholder: 'Tool suchen...',
      browseCategories: 'Kategorien durchsuchen',
      popularTools: 'Beliebte Tools',
      recentlyAdded: 'Kürzlich hinzugefügt',
    },
    category: { tools: 'Tools', noTools: 'Keine Tools in dieser Kategorie.' },
    search: { results: 'Suchergebnisse', noResults: 'Keine Tools gefunden.', query: 'Suche' },
    notFound: { title: 'Seite nicht gefunden', description: 'Die gesuchte Seite existiert nicht.', backHome: 'Zurück zur Startseite' },
  },
  footer: {
  about: 'About',
  categories: 'Categories',
  legal: 'Legal',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  contact: 'Contact',
  copyright: 'All rights reserved.'
},
};

const I18nContext = createContext<I18nContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const value: I18nContextValue = { locale, setLocale, t: translations[locale] };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

// Localized tool wrapper — falls back to English for non-English locales
export function useLocalizedTool(tool: Tool): Tool {
  const { locale } = useI18n();
  if (locale === 'en') return tool;
  return tool;
}
import type { Category } from "../data/toolRegistry";

export function useLocalizedCategory(category: Category): Category {
  const { locale } = useI18n();

  if (locale === "en") {
    return category;
  }

  return category;
}
export function useLocalizedFaq(faqs: Faq[]): Faq[] {
  return faqs;
}
