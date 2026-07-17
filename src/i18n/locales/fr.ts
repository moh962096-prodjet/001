import type { Translation } from '../types';
import { getAllTools } from '../../data/toolRegistry';

function buildToolTranslations(): Translation['tools'] {
  const tools: Translation['tools'] = {};
  for (const tool of getAllTools()) {
    const tr = frTools[tool.slug];
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

const frTools: Translation['tools'] = {
  'bmi-calculator': {
    title: 'Calculatrice d\'IMC',
    description: 'Calculez votre Indice de Masse Corporelle (IMC) pour déterminer si votre poids est dans une plage saine.',
    metaDescription: 'Calculatrice d\'IMC gratuite. Calculez votre Indice de Masse Corporelle instantanément. Découvrez si votre poids est sain pour votre taille.',
    keywords: ['imc', 'indice de masse corporelle', 'poids', 'santé'],
    explanation: 'L\'Indice de Masse Corporelle (IMC) est une mesure de la graisse corporelle basée sur le poids et la taille. Il est largement utilisé comme outil de dépistage pour identifier si un adulte est en sous-poids, de poids normal, en surpoids ou obèse. IMC = poids(kg) / taille(m)².',
    faqs: [
      { question: 'Quelle est une plage d\'IMC saine ?', answer: 'Un IMC entre 18,5 et 24,9 est considéré comme sain pour la plupart des adultes.' },
      { question: 'L\'IMC est-il précis pour les athlètes ?', answer: 'L\'IMC peut surestimer la graisse corporelle chez les athlètes ayant une masse musculaire élevée. C\'est un outil de dépistage général, pas un diagnostic.' },
    ],
  },
  'percentage-calculator': {
    title: 'Calculatrice de Pourcentage',
    description: 'Calculez des pourcentages, des augmentations, des diminutions et plus encore.',
    metaDescription: 'Calculatrice de pourcentage gratuite. Calculez quel est X% de Y, l\'augmentation/diminution en pourcentage et plus encore.',
    keywords: ['pourcentage', 'pour cent', 'mathématiques'],
    explanation: 'Un pourcentage est un nombre ou un rapport exprimé comme une fraction de 100. Cette calculatrice trouve quel pourcentage une valeur représente d\'une autre.',
    faqs: [
      { question: 'Comment calculer un pourcentage ?', answer: 'Divisez la valeur par le total et multipliez par 100. Par exemple, 50/200 × 100 = 25%.' },
    ],
  },
  'loan-calculator': {
    title: 'Calculatrice de Prêt',
    description: 'Calculez les paiements mensuels du prêt, les intérêts totaux et le coût total.',
    metaDescription: 'Calculatrice de prêt gratuite. Calculez les paiements mensuels, les intérêts totaux et le coût total pour tout montant de prêt.',
    keywords: ['prêt', 'hypothèque', 'paiement', 'intérêt'],
    explanation: 'Cette calculatrice de prêt utilise la formule d\'amortissement standard pour calculer les paiements mensuels. La formule tient compte du montant principal, du taux d\'intérêt annuel et de la durée du prêt.',
    faqs: [
      { question: 'Comment le paiement mensuel est-il calculé ?', answer: 'En utilisant la formule d\'amortissement : M = P × r(1+r)^n / ((1+r)^n - 1), où P est le principal, r est le taux mensuel et n est le nombre de paiements.' },
    ],
  },
};

const fr: Translation = {
  meta: {
    siteName: 'ToolVerse',
    title: 'ToolVerse — Calculatrices en Ligne Gratuites et Outils Intelligents',
    description: 'ToolVerse propose plus de 35 calculatrices en ligne gratuites et outils intelligents — santé, finances, mathématiques, convertisseurs d\'unités, outils PDF et images, utilitaires pour développeurs et plus encore. Rapides, précis et faciles à utiliser.',
    keywords: 'calculatrices en ligne, outils gratuits, calculatrice santé, calculatrice financière, calculatrice mathématique, convertisseur d\'unités, outils PDF, outils images, outils développeur',
  },
  nav: { categories: 'Catégories', search: 'Rechercher des outils', searchPlaceholder: 'Rechercher des outils...', searchResultsLabel: 'Résultats de recherche', language: 'Langue' },
  home: {
    badge: (n: number) => `${n}+ outils gratuits — sans inscription`,
    heroTitle: 'Calculatrices en Ligne Gratuites',
    heroTitleAccent: 'et Outils Intelligents',
    heroSubtitle: 'Calculatrices et utilitaires rapides, précis et faciles à utiliser pour la santé, les finances, les mathématiques et les tâches quotidiennes. Tous les outils fonctionnent dans votre navigateur — gratuits, privés et instantanés.',
    searchPlaceholder: 'Rechercher un outil... (ex. IMC, prêt, code QR)',
    searchButton: 'Rechercher',
    noResults: 'Aucun outil trouvé. Essayez un autre terme de recherche.',
    browseTitle: 'Parcourir par Catégorie',
    browseSubtitle: 'Explorez nos outils organisés par catégorie',
    popularTitle: 'Outils Populaires',
    recentlyAddedTitle: 'Récemment Ajoutés',
    faqTitle: 'Questions Fréquentes',
    toolCount: (count: number) => `${count} outil${count !== 1 ? 's' : ''}`,
  },
  category: { notFoundTitle: 'Catégorie introuvable', notFoundMessage: 'La catégorie que vous recherchez n\'existe pas.', otherCategoriesTitle: 'Autres Catégories', emptyMessage: 'Aucun outil dans cette catégorie pour le moment. Revenez bientôt !' },
  tool: { calculate: 'Calculer', reset: 'Réinitialiser', aboutTitle: 'À propos de', faqTitle: 'FAQ', relatedTools: 'Outils Connexes', share: 'Partager :', advertisement: 'Publicité', errorRequired: 'Veuillez remplir tous les champs obligatoires avec des valeurs valides.', errorCalculation: 'Une erreur s\'est produite lors du calcul. Veuillez vérifier vos données.' },
  footer: { description: 'Calculatrices en ligne gratuites et outils intelligents pour les tâches quotidiennes. Rapides, précis et faciles à utiliser.', categoriesTitle: 'Catégories', moreTitle: 'Plus', companyTitle: 'Entreprise', about: 'À propos', contact: 'Contact', privacy: 'Politique de Confidentialité', terms: 'Conditions', disclaimer: 'Avertissement', copyright: 'Tous droits réservés. Les outils sont fournis à titre informatif uniquement.' },
  newsletter: { title: 'Restez Informé des Nouveaux Outils', subtitle: 'Soyez notifié lorsque nous ajoutons de nouvelles calculatrices et outils. Pas de spam, désabonnement à tout moment.', placeholder: 'Entrez votre email', button: 'S\'abonner', success: 'Merci de votre inscription !' },
  faq: { defaultTitle: 'Questions Fréquentes' },
  share: { label: 'Partager :', twitter: 'Partager sur Twitter', facebook: 'Partager sur Facebook', linkedin: 'Partager sur LinkedIn', copyLink: 'Copier le lien', copied: 'Copié !' },
  notFound: { title: 'Page Introuvable — ToolVerse', message: 'Oups ! La page que vous recherchez n\'existe pas.', backHome: 'Retour à l\'Accueil' },
  cookieConsent: {
    title: 'Nous respectons votre vie privée',
    message: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et afficher des publicités pertinentes. Vous pouvez choisir les cookies à autoriser.',
    accept: 'Tout accepter',
    reject: 'Tout refuser',
    customize: 'Personnaliser',
    learnMore: 'En savoir plus',
    necessary: 'Nécessaires',
    necessaryDesc: 'Cookies essentiels au fonctionnement du site. Ne peuvent pas être désactivés.',
    analytics: 'Analytiques',
    analyticsDesc: 'Google Analytics pour comprendre comment les visiteurs utilisent notre site.',
    advertising: 'Publicité',
    advertisingDesc: 'Cookies Google AdSense pour afficher des publicités personnalisées.',
    save: 'Enregistrer les préférences',
  },
  staticPages: {
    aboutTitle: 'À propos de ToolVerse',
    aboutBody: ['ToolVerse est une plateforme en ligne gratuite offrant une collection croissante de calculatrices et d\'outils intelligents pour un usage quotidien.', 'Tous les outils fonctionnent directement dans votre navigateur, garantissant que vos données restent privées.'],
    contactTitle: 'Contactez-nous',
    contactBody: ['Vous avez une question ou une suggestion ? Écrivez-nous à hello@toolverse.app.'],
    privacyTitle: 'Politique de Confidentialité',
    privacyBody: ['ToolVerse respecte votre vie privée. Tous les calculs se font localement dans votre navigateur.', 'Nous utilisons Google Analytics et AdSense qui utilisent des cookies. Vous pouvez contrôler vos préférences de cookies à tout moment.'],
    termsTitle: 'Conditions d\'Utilisation',
    termsBody: ['En utilisant ToolVerse, vous acceptez d\'utiliser nos outils uniquement à des fins licites. Les outils sont fournis "tels quels" sans garantie d\'aucune sorte.'],
    disclaimerTitle: 'Avertissement',
    disclaimerBody: ['Les outils de ToolVerse sont fournis à des fins informatives et éducatives uniquement. Ils ne constituent pas un conseil professionnel.'],
  },
  categories: {
    'health-calculators': { name: 'Calculatrices de Santé', description: 'IMC, calories, âge et autres calculatrices de bien-être.' },
    'finance-calculators': { name: 'Calculatrices Financières', description: 'Prêts, hypothèques, EMI et outils financiers.' },
    'math-calculators': { name: 'Calculatrices Mathématiques', description: 'Pourcentages, ratios et mathématiques quotidiennes.' },
    'unit-converters': { name: 'Convertisseurs d\'Unités', description: 'Longueur, poids, température et plus.' },
    'time-date-tools': { name: 'Outils de Temps et Date', description: 'Dates, durées et utilitaires de temps.' },
    'pdf-tools': { name: 'Outils PDF', description: 'Fusionner, convertir et gérer des fichiers PDF.' },
    'image-tools': { name: 'Outils d\'Images', description: 'Compresser, convertir et gérer des images.' },
    'text-tools': { name: 'Outils de Texte', description: 'Compter les mots, formater et analyser du texte.' },
    'developer-tools': { name: 'Outils pour Développeurs', description: 'Mots de passe, codes QR et utilitaires de code.' },
    'everyday-calculators': { name: 'Calculatrices Quotidiennes', description: 'Aides rapides pour les tâches quotidiennes.' },
  },
  tools: buildToolTranslations(),
};

export default fr;
