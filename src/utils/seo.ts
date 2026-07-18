import { useEffect } from 'react';
import type { Tool } from '../data/toolRegistry';
import { categoryMap } from '../data/categories';

interface SeoOptions {
  title: string;
  description: string;
  canonicalPath: string;
  keywords?: string[];
  jsonLd?: object;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

const BASE_URL = 'https://toolvers.vercel.app';

export function useSeo({ title, description, canonicalPath, keywords, jsonLd }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    const url = `${BASE_URL}${canonicalPath}`;
    setMeta('name', 'description', description);
    if (keywords?.length) setMeta("name", "keywords", keywords.join(", "));
    setLink('canonical', url);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (jsonLd) setJsonLd('tool-jsonld', jsonLd);
  }, [title, description, canonicalPath, keywords, jsonLd]);
}

export function useToolSeo(tool: Tool) {
  const cat = categoryMap[tool.category];
  const path = `/tools/${tool.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.title,
        description: tool.metaDescription,
        url: `${BASE_URL}${path}`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: cat?.name ?? tool.category, item: `${BASE_URL}/category/${tool.category}` },
          { '@type': 'ListItem', position: 3, name: tool.title, item: `${BASE_URL}${path}` },
        ],
      },
    ],
  };
  useSeo({
    title: `${tool.title} - ToolVerse`,
    description: tool.metaDescription,
    canonicalPath: path,
    keywords: tool.keywords,
    jsonLd,
  });
}
