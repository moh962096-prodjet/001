import type { Translation } from '../types';
import { getAllTools } from '../../data/toolRegistry';

/**
 * English translation file.
 * Tool translations are auto-extracted from the existing registry
 * to avoid duplicating 34 tools' worth of English content.
 * When adding a new tool, its English content is automatically included.
 */
function buildToolTranslations(): Translation['tools'] {
  const tools: Translation['tools'] = {};
  for (const tool of getAllTools()) {
    tools[tool.slug] = {
      title: tool.title,
      description: tool.description,
      metaDescription: tool.metaDescription,
      keywords: tool.keywords,
      explanation: tool.explanation,
      faqs: tool.faqs,
    };
  }
  return tools;
}

const en: Translation = {
  meta: {
    siteName: 'ToolVerse',
    title: 'ToolVerse — Free Online Calculators & Smart Tools',
    description:
      'ToolVerse offers 35+ free online calculators and smart tools — health, finance, math, unit converters, PDF & image tools, developer utilities and more. Fast, accurate, and easy to use.',
    keywords:
      'online calculators, free tools, health calculator, finance calculator, math calculator, unit converter, PDF tools, image tools, developer tools',
  },

  nav: {
    categories: 'Categories',
    search: 'Search tools',
    searchPlaceholder: 'Search tools...',
    searchResultsLabel: 'Search results',
    language: 'Language',
  },

  home: {
    badge: (n: number) => `${n}+ free tools — no signup required`,
    heroTitle: 'Free Online Calculators',
    heroTitleAccent: '& Smart Tools',
    heroSubtitle:
      'Fast, accurate, and easy-to-use calculators and utilities for health, finance, math, and everyday tasks. All tools run right in your browser — free, private, and instant.',
    searchPlaceholder: 'Search for a tool... (e.g. BMI, loan, QR code)',
    searchButton: 'Search',
    noResults: 'No tools found. Try a different search term.',
    browseTitle: 'Browse by Category',
    browseSubtitle: 'Explore our tools organized by category',
    popularTitle: 'Popular Tools',
    recentlyAddedTitle: 'Recently Added',
    faqTitle: 'Frequently Asked Questions',
    toolCount: (count: number) => `${count} tool${count !== 1 ? 's' : ''}`,
  },

  category: {
    notFoundTitle: 'Category not found',
    notFoundMessage: 'The category you are looking for does not exist.',
    otherCategoriesTitle: 'Other Categories',
    emptyMessage: 'No tools in this category yet. Check back soon!',
  },

  tool: {
    calculate: 'Calculate',
    reset: 'Reset',
    aboutTitle: 'About',
    faqTitle: 'FAQ',
    relatedTools: 'Related Tools',
    share: 'Share:',
    advertisement: 'Advertisement',
    errorRequired: 'Please fill in all required fields with valid values.',
    errorCalculation: 'An error occurred during calculation. Please check your inputs.',
  },

  footer: {
    description:
      'Free online calculators and smart tools for everyday tasks. Fast, accurate, and easy to use.',
    categoriesTitle: 'Categories',
    moreTitle: 'More',
    companyTitle: 'Company',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy Policy',
    terms: 'Terms',
    disclaimer: 'Disclaimer',
    copyright: 'All rights reserved. Tools are for informational purposes only.',
  },

  newsletter: {
    title: 'Stay Updated with New Tools',
    subtitle: 'Get notified when we add new calculators and tools. No spam, unsubscribe anytime.',
    placeholder: 'Enter your email',
    button: 'Subscribe',
    success: 'Thanks for subscribing!',
  },

  faq: {
    defaultTitle: 'Frequently Asked Questions',
  },

  share: {
    label: 'Share:',
    twitter: 'Share on Twitter',
    facebook: 'Share on Facebook',
    linkedin: 'Share on LinkedIn',
    copyLink: 'Copy link',
    copied: 'Copied!',
  },

  notFound: {
    title: 'Page Not Found — ToolVerse',
    message: "Oops! The page you are looking for doesn't exist.",
    backHome: 'Back to Home',
  },

  cookieConsent: {
    title: 'We value your privacy',
    message: 'We use cookies to enhance your experience, analyze traffic, and serve relevant ads. You can choose which cookies to allow.',
    accept: 'Accept all',
    reject: 'Reject all',
    customize: 'Customize',
    learnMore: 'Learn more',
    necessary: 'Necessary',
    necessaryDesc: 'Essential cookies for the website to function. Cannot be disabled.',
    analytics: 'Analytics',
    analyticsDesc: 'Google Analytics to understand how visitors use our site.',
    advertising: 'Advertising',
    advertisingDesc: 'Google AdSense cookies to serve personalized ads.',
    save: 'Save preferences',
  },

  staticPages: {
    aboutTitle: 'About ToolVerse',
    aboutBody: [
      'ToolVerse is a free online platform offering a growing collection of calculators and smart tools for everyday use. Our mission is to make useful utilities accessible to everyone — fast, accurate, and completely free.',
      'From health and finance calculators to PDF and image tools, we cover a wide range of categories to help you get things done quickly without installing any software. All our tools run directly in your browser, ensuring your data stays private.',
    ],
    contactTitle: 'Contact Us',
    contactBody: [
      "Have a question, suggestion, or found a bug? We'd love to hear from you.",
      "Email us at hello@toolverse.app and we'll get back to you as soon as possible.",
    ],
    privacyTitle: 'Privacy Policy',
    privacyBody: [
      'ToolVerse respects your privacy. All calculations and file processing happen locally in your browser. We do not upload, store, or share your data.',
      'We may use third-party advertising (such as Google AdSense) which uses cookies to serve relevant ads. You can opt out of personalized advertising in your browser settings.',
      'We do not collect personal information unless you voluntarily subscribe to our newsletter, in which case we only store your email address.',
    ],
    termsTitle: 'Terms of Service',
    termsBody: [
      'By using ToolVerse, you agree to use our tools for lawful purposes only. The tools are provided "as is" without warranties of any kind.',
      'You are responsible for verifying the accuracy of any results before making decisions based on them. ToolVerse is not liable for any damages arising from the use of our tools.',
    ],
    disclaimerTitle: 'Disclaimer',
    disclaimerBody: [
      'The tools and calculators on ToolVerse are provided for informational and educational purposes only. They are not intended as professional advice.',
      'Health calculators (such as BMI and calorie calculators) are not a substitute for medical advice. Financial calculators are not financial advice. Always consult a qualified professional before making important decisions.',
    ],
  },

  categories: {
    'health-calculators': { name: 'Health Calculators', description: 'BMI, calorie, age and other wellness calculators.' },
    'finance-calculators': { name: 'Finance Calculators', description: 'Loans, mortgages, EMI and money tools.' },
    'math-calculators': { name: 'Math Calculators', description: 'Percentages, ratios and everyday math.' },
    'unit-converters': { name: 'Unit Converters', description: 'Length, weight, temperature and more.' },
    'time-date-tools': { name: 'Time & Date Tools', description: 'Dates, durations and time utilities.' },
    'pdf-tools': { name: 'PDF Tools', description: 'Merge, convert and manage PDF files.' },
    'image-tools': { name: 'Image Tools', description: 'Compress, convert and handle images.' },
    'text-tools': { name: 'Text Tools', description: 'Count words, format and analyze text.' },
    'developer-tools': { name: 'Developer Tools', description: 'Passwords, QR codes and code utilities.' },
    'everyday-calculators': { name: 'Everyday Calculators', description: 'Quick helpers for daily tasks.' },
  },

  tools: buildToolTranslations(),
};

export default en;
