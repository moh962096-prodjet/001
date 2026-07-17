import type { Translation } from '../types';
import { getAllTools } from '../../data/toolRegistry';

function buildToolTranslations(): Translation['tools'] {
  const tools: Translation['tools'] = {};
  for (const tool of getAllTools()) {
    const tr = deTools[tool.slug];
    if (tr) {
      tools[tool.slug] = tr;
    } else {
      tools[tool.slug] = {
        title: tool.title, description: tool.description,
        metaDescription: tool.metaDescription, keywords: tool.keywords,
        explanation: tool.explanation, faqs: tool.faqs,
      };
    }
  }
  return tools;
}

const deTools: Translation['tools'] = {
  'bmi-calculator': {
    title: 'BMI-Rechner',
    description: 'Berechnen Sie Ihren Body-Mass-Index (BMI), um festzustellen, ob Ihr Gewicht in einem gesunden Bereich liegt.',
    metaDescription: 'Kostenloser BMI-Rechner. Berechnen Sie sofort Ihren Body-Mass-Index. Finden Sie heraus, ob Ihr Gewicht für Ihre Größe gesund ist.',
    keywords: ['bmi', 'body-mass-index', 'gewicht', 'gesundheit'],
    explanation: 'Der Body-Mass-Index (BMI) ist ein Maß für Körperfett basierend auf Gewicht und Größe. Er wird weithin als Screening-Tool verwendet, um festzustellen, ob ein Erwachsener untergewichtig, normalgewichtig, übergewichtig oder fettleibig ist. BMI = Gewicht(kg) / Größe(m)².',
    faqs: [
      { question: 'Was ist ein gesunder BMI-Bereich?', answer: 'Ein BMI zwischen 18,5 und 24,9 gilt für die meisten Erwachsenen als gesund.' },
      { question: 'Ist der BMI für Sportler genau?', answer: 'Der BMI kann bei Sportlern mit hoher Muskelmasse das Körperfett überschätzen. Es ist ein allgemeines Screening-Tool, keine Diagnose.' },
    ],
  },
  'percentage-calculator': {
    title: 'Prozentrechner',
    description: 'Berechnen Sie Prozentsätze, Zunahmen, Abnahmen und mehr.',
    metaDescription: 'Kostenloser Prozentrechner. Berechnen Sie, was X% von Y ist, prozentuale Zunahme/Abnahme und mehr.',
    keywords: ['prozent', 'prozentsatz', 'mathematik'],
    explanation: 'Ein Prozentsatz ist eine Zahl oder ein Verhältnis, ausgedrückt als Bruchteil von 100. Dieser Rechner findet, welchen Prozentsatz ein Wert von einem anderen darstellt.',
    faqs: [
      { question: 'Wie berechne ich einen Prozentsatz?', answer: 'Teilen Sie den Wert durch die Gesamtsumme und multiplizieren Sie mit 100. Zum Beispiel 50/200 × 100 = 25%.' },
    ],
  },
  'loan-calculator': {
    title: 'Kreditrechner',
    description: 'Berechnen Sie monatliche Kreditzahlungen, Gesamtzinsen und Gesamtkosten.',
    metaDescription: 'Kostenloser Kreditrechner. Berechnen Sie monatliche Zahlungen, Gesamtzinsen und Gesamtkosten für jeden Kreditbetrag.',
    keywords: ['kredit', 'hypothek', 'zahlung', 'zins'],
    explanation: 'Dieser Kreditrechner verwendet die Standard-Amortisationsformel zur Berechnung der monatlichen Zahlungen. Die Formel berücksichtigt den Kapitalbetrag, den Jahreszins und die Kreditlaufzeit.',
    faqs: [
      { question: 'Wie wird die monatliche Zahlung berechnet?', answer: 'Mit der Amortisationsformel: M = P × r(1+r)^n / ((1+r)^n - 1), wobei P das Kapital, r der monatliche Zinssatz und n die Anzahl der Zahlungen ist.' },
    ],
  },
};

const de: Translation = {
  meta: {
    siteName: 'ToolVerse',
    title: 'ToolVerse — Kostenlose Online-Rechner und Intelligente Werkzeuge',
    description: 'ToolVerse bietet über 35 kostenlose Online-Rechner und intelligente Werkzeuge — Gesundheit, Finanzen, Mathematik, Einheitenumrechner, PDF- und Bild-Tools, Entwickler-Dienstprogramme und mehr. Schnell, präzise und einfach zu bedienen.',
    keywords: 'online-rechner, kostenlose tools, gesundheitsrechner, finanzrechner, mathematik-rechner, einheitenumrechner, pdf-tools, bild-tools, entwickler-tools',
  },
  nav: { categories: 'Kategorien', search: 'Werkzeuge suchen', searchPlaceholder: 'Werkzeuge suchen...', searchResultsLabel: 'Suchergebnisse', language: 'Sprache' },
  home: {
    badge: (n: number) => `${n}+ kostenlose Werkzeuge — keine Anmeldung`,
    heroTitle: 'Kostenlose Online-Rechner',
    heroTitleAccent: 'und Intelligente Werkzeuge',
    heroSubtitle: 'Schnelle, präzise und einfach zu bedienende Rechner und Dienstprogramme für Gesundheit, Finanzen, Mathematik und alltägliche Aufgaben. Alle Werkzeuge laufen direkt in Ihrem Browser — kostenlos, privat und sofort.',
    searchPlaceholder: 'Werkzeug suchen... (z.B. BMI, Kredit, QR-Code)',
    searchButton: 'Suchen',
    noResults: 'Keine Werkzeuge gefunden. Versuchen Sie einen anderen Suchbegriff.',
    browseTitle: 'Nach Kategorie Durchsuchen',
    browseSubtitle: 'Entdecken Sie unsere nach Kategorie organisierten Werkzeuge',
    popularTitle: 'Beliebte Werkzeuge',
    recentlyAddedTitle: 'Kürzlich Hinzugefügt',
    faqTitle: 'Häufig Gestellte Fragen',
    toolCount: (count: number) => `${count} Werkzeug${count !== 1 ? 'e' : ''}`,
  },
  category: { notFoundTitle: 'Kategorie nicht gefunden', notFoundMessage: 'Die gesuchte Kategorie existiert nicht.', otherCategoriesTitle: 'Andere Kategorien', emptyMessage: 'Noch keine Werkzeuge in dieser Kategorie. Schauen Sie bald wieder!' },
  tool: { calculate: 'Berechnen', reset: 'Zurücksetzen', aboutTitle: 'Über', faqTitle: 'FAQ', relatedTools: 'Verwandte Werkzeuge', share: 'Teilen:', advertisement: 'Werbung', errorRequired: 'Bitte füllen Sie alle Pflichtfelder mit gültigen Werten aus.', errorCalculation: 'Bei der Berechnung ist ein Fehler aufgetreten. Bitte überprüfen Sie Ihre Eingaben.' },
  footer: { description: 'Kostenlose Online-Rechner und intelligente Werkzeuge für alltägliche Aufgaben. Schnell, präzise und einfach zu bedienen.', categoriesTitle: 'Kategorien', moreTitle: 'Mehr', companyTitle: 'Unternehmen', about: 'Über uns', contact: 'Kontakt', privacy: 'Datenschutz', terms: 'AGB', disclaimer: 'Haftungsausschluss', copyright: 'Alle Rechte vorbehalten. Werkzeuge dienen nur Informationszwecken.' },
  newsletter: { title: 'Bleiben Sie über Neue Werkzeuge Informiert', subtitle: 'Werden Sie benachrichtigt, wenn wir neue Rechner und Werkzeuge hinzufügen. Kein Spam, jederzeit abbestellbar.', placeholder: 'E-Mail eingeben', button: 'Abonnieren', success: 'Danke für Ihr Abonnement!' },
  faq: { defaultTitle: 'Häufig Gestellte Fragen' },
  share: { label: 'Teilen:', twitter: 'Auf Twitter teilen', facebook: 'Auf Facebook teilen', linkedin: 'Auf LinkedIn teilen', copyLink: 'Link kopieren', copied: 'Kopiert!' },
  notFound: { title: 'Seite Nicht Gefunden — ToolVerse', message: 'Hoppla! Die gesuchte Seite existiert nicht.', backHome: 'Zurück zur Startseite' },
  cookieConsent: {
    title: 'Wir schätzen Ihre Privatsphäre',
    message: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, Datenverkehr zu analysieren und relevante Anzeigen zu schalten. Sie können wählen, welche Cookies Sie zulassen.',
    accept: 'Alle akzeptieren',
    reject: 'Alle ablehnen',
    customize: 'Anpassen',
    learnMore: 'Mehr erfahren',
    necessary: 'Notwendig',
    necessaryDesc: 'Essenzielle Cookies für das Funktionieren der Website. Können nicht deaktiviert werden.',
    analytics: 'Analytik',
    analyticsDesc: 'Google Analytics, um zu verstehen, wie Besucher unsere Website nutzen.',
    advertising: 'Werbung',
    advertisingDesc: 'Google AdSense-Cookies, um personalisierte Anzeigen zu schalten.',
    save: 'Einstellungen speichern',
  },
  staticPages: {
    aboutTitle: 'Über ToolVerse',
    aboutBody: ['ToolVerse ist eine kostenlose Online-Plattform, die eine wachsende Sammlung von Rechnern und intelligenten Werkzeugen für den täglichen Gebrauch anbietet.', 'Alle Werkzeuge laufen direkt in Ihrem Browser und stellen sicher, dass Ihre Daten privat bleiben.'],
    contactTitle: 'Kontakt',
    contactBody: ['Haben Sie eine Frage oder einen Vorschlag? Schreiben Sie uns an hello@toolverse.app.'],
    privacyTitle: 'Datenschutz',
    privacyBody: ['ToolVerse respektiert Ihre Privatsphäre. Alle Berechnungen erfolgen lokal in Ihrem Browser.', 'Wir verwenden Google Analytics und AdSense, die Cookies verwenden. Sie können Ihre Cookie-Einstellungen jederzeit verwalten.'],
    termsTitle: 'AGB',
    termsBody: ['Durch die Nutzung von ToolVerse erklären Sie sich einverstanden, unsere Werkzeuge nur für rechtmäßige Zwecke zu verwenden. Die Werkzeuge werden "wie besehen" ohne Gewährleistung jeglicher Art bereitgestellt.'],
    disclaimerTitle: 'Haftungsausschluss',
    disclaimerBody: ['Die Werkzeuge von ToolVerse dienen nur Informations- und Bildungszwecken. Sie stellen keine professionelle Beratung dar.'],
  },
  categories: {
    'health-calculators': { name: 'Gesundheitsrechner', description: 'BMI, Kalorien, Alter und weitere Wellness-Rechner.' },
    'finance-calculators': { name: 'Finanzrechner', description: 'Kredite, Hypotheken, EMI und Geldwerkzeuge.' },
    'math-calculators': { name: 'Mathematik-Rechner', description: 'Prozentsätze, Verhältnisse und alltägliche Mathematik.' },
    'unit-converters': { name: 'Einheitenumrechner', description: 'Länge, Gewicht, Temperatur und mehr.' },
    'time-date-tools': { name: 'Zeit- & Datum-Werkzeuge', description: 'Daten, Dauern und Zeit-Dienstprogramme.' },
    'pdf-tools': { name: 'PDF-Werkzeuge', description: 'PDF-Dateien zusammenführen, konvertieren und verwalten.' },
    'image-tools': { name: 'Bild-Werkzeuge', description: 'Bilder komprimieren, konvertieren und verarbeiten.' },
    'text-tools': { name: 'Text-Werkzeuge', description: 'Wörter zählen, Text formatieren und analysieren.' },
    'developer-tools': { name: 'Entwickler-Werkzeuge', description: 'Passwörter, QR-Codes und Code-Dienstprogramme.' },
    'everyday-calculators': { name: 'Alltagsrechner', description: 'Schnelle Helfer für tägliche Aufgaben.' },
  },
  tools: buildToolTranslations(),
};

export default de;
