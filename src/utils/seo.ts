import { useEffect } from 'react';
import type { Tool } from '../data/toolRegistry';
import { categoryMap } from '../data/categories';
import { LOCALES, DEFAULT_LOCALE, type Locale } from '../i18n/config';
import { useI18n, useLocalizedTool } from '../i18n';

const SITE_URL = 'https://toolvers.vercel.app';
const SITE_NAME = 'ToolVerse';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setHreflang(pathWithoutLocale: string) {
  document.head.querySelectorAll('link[data-hreflang]').forEach((el) => el.remove());

  for (const loc of LOCALES) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', loc.hreflang);
    link.setAttribute('href', `${SITE_URL}${localePath(loc.code, pathWithoutLocale)}`);
    link.setAttribute('data-hreflang', loc.hreflang);
    document.head.appendChild(link);
  }

  const defaultLink = document.createElement('link');
  defaultLink.setAttribute('rel', 'alternate');
  defaultLink.setAttribute('hreflang', 'x-default');
  defaultLink.setAttribute('href', `${SITE_URL}${localePath(DEFAULT_LOCALE, pathWithoutLocale)}`);
  defaultLink.setAttribute('data-hreflang', 'x-default');
  document.head.appendChild(defaultLink);
}

function localePath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`;
}

function setJsonLd(id: string, data: object) {
  let script = document.head.querySelector(`script[data-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-jsonld', id);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const script = document.head.querySelector(`script[data-jsonld="${id}"]`);
  if (script) script.remove();
}

export function usePageMeta(title: string, description: string, pathWithoutLocale: string) {
  const { locale } = useI18n();
  const localizedPath = localePath(locale, pathWithoutLocale);

  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setCanonical(`${SITE_URL}${localizedPath}`);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${SITE_URL}${localizedPath}`);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setHreflang(pathWithoutLocale);
  }, [title, description, pathWithoutLocale, locale, localizedPath]);
}

export function useToolSeo(tool: Tool) {
  const { locale, t } = useI18n();
  const localizedTool = useLocalizedTool(tool);
  const pathWithoutLocale = `/tools/${tool.slug}`;
  const localizedPath = localePath(locale, pathWithoutLocale);
  const cat = categoryMap[tool.category];
  const catTr = t.categories[tool.category];

  useEffect(() => {
    setMeta('name', 'keywords', localizedTool.keywords.join(', '));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: localizedTool.title,
      description: localizedTool.metaDescription,
      url: `${SITE_URL}${localizedPath}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: SITE_NAME },
    };
    setJsonLd('tool', jsonLd);

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: localizedTool.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    };
    setJsonLd('faq', faqLd);

    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.meta.siteName, item: SITE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: catTr?.name ?? cat?.name ?? tool.category,
          item: `${SITE_URL}${localePath(locale, `/category/${tool.category}`)}`,
        },
        { '@type': 'ListItem', position: 3, name: localizedTool.title, item: `${SITE_URL}${localizedPath}` },
      ],
    };
    setJsonLd('breadcrumb', breadcrumbLd);

    setHreflang(pathWithoutLocale);

    return () => {
      removeJsonLd('tool');
      removeJsonLd('faq');
      removeJsonLd('breadcrumb');
    };
  }, [localizedTool, localizedPath, pathWithoutLocale, cat, catTr, tool.category, locale, t.meta.siteName]);
}

export function useHomeSeo() {
  const { locale, t } = useI18n();
  const pathWithoutLocale = '/';
  const localizedPath = localePath(locale, pathWithoutLocale);

  useEffect(() => {
    document.title = t.meta.title;
    setMeta('name', 'description', t.meta.description);
    setMeta('name', 'keywords', t.meta.keywords);
    setCanonical(`${SITE_URL}${localizedPath}`);
    setMeta('property', 'og:title', t.meta.title);
    setMeta('property', 'og:description', t.meta.description);
    setMeta('property', 'og:url', `${SITE_URL}${localizedPath}`);
    setMeta('name', 'twitter:title', t.meta.title);
    setMeta('name', 'twitter:description', t.meta.description);
    setHreflang(pathWithoutLocale);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
    setJsonLd('website', jsonLd);

    const orgLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    };
    setJsonLd('organization', orgLd);

    return () => {
      removeJsonLd('website');
      removeJsonLd('organization');
    };
  }, [locale, t, localizedPath]);
}

export function useCategorySeo(categoryId: string) {
  const { locale, t } = useI18n();
  const cat = categoryMap[categoryId];
  const catTr = t.categories[categoryId];
  const pathWithoutLocale = `/category/${categoryId}`;
  const localizedPath = localePath(locale, pathWithoutLocale);

  useEffect(() => {
    if (!cat) return;
    const name = catTr?.name ?? cat.name;
    const description = catTr?.description ?? cat.description;

    document.title = `${name} — ${SITE_NAME}`;
    setMeta('name', 'description', description);
    setCanonical(`${SITE_URL}${localizedPath}`);
    setMeta('property', 'og:title', `${name} — ${SITE_NAME}`);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${SITE_URL}${localizedPath}`);
    setHreflang(pathWithoutLocale);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name,
      description,
      url: `${SITE_URL}${localizedPath}`,
    };
    setJsonLd('collection', jsonLd);
    return () => removeJsonLd('collection');
  }, [cat, catTr, categoryId, locale, localizedPath, pathWithoutLocale]);
}

export { SITE_URL, SITE_NAME };
