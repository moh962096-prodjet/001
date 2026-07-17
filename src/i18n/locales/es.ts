import type { Translation } from '../types';
import { getAllTools } from '../../data/toolRegistry';

function buildToolTranslations(): Translation['tools'] {
  const tools: Translation['tools'] = {};
  for (const tool of getAllTools()) {
    const tr = esTools[tool.slug];
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

const esTools: Translation['tools'] = {
  'bmi-calculator': {
    title: 'Calculadora de IMC',
    description: 'Calcula tu Índice de Masa Corporal (IMC) para determinar si tu peso está en un rango saludable.',
    metaDescription: 'Calculadora de IMC gratuita. Calcula tu Índice de Masa Corporal al instante. Descubre si tu peso es saludable para tu altura.',
    keywords: ['imc', 'índice de masa corporal', 'peso', 'salud'],
    explanation: 'El Índice de Masa Corporal (IMC) es una medida de la grasa corporal basada en el peso y la altura. Se usa ampliamente como herramienta de detección para identificar si un adulto tiene bajo peso, peso normal, sobrepeso u obesidad. IMC = peso(kg) / altura(m)².',
    faqs: [
      { question: '¿Cuál es un rango de IMC saludable?', answer: 'Un IMC entre 18.5 y 24.9 se considera saludable para la mayoría de los adultos.' },
      { question: '¿Es preciso el IMC para atletas?', answer: 'El IMC puede sobreestimar la grasa corporal en atletas con mucha masa muscular. Es una herramienta de detección general, no un diagnóstico.' },
    ],
  },
  'percentage-calculator': {
    title: 'Calculadora de Porcentajes',
    description: 'Calcula porcentajes, aumentos, disminuciones y más.',
    metaDescription: 'Calculadora de porcentajes gratuita. Calcula qué es X% de Y, aumento/disminución porcentual y más.',
    keywords: ['porcentaje', 'porcentajes', 'matemáticas'],
    explanation: 'Un porcentaje es un número o razón expresado como una fracción de 100. Esta calculadora encuentra qué porcentaje es un valor de otro.',
    faqs: [
      { question: '¿Cómo calculo un porcentaje?', answer: 'Divide el valor entre el total y multiplica por 100. Por ejemplo, 50/200 × 100 = 25%.' },
    ],
  },
  'loan-calculator': {
    title: 'Calculadora de Préstamos',
    description: 'Calcula los pagos mensuales del préstamo, el interés total y el costo total.',
    metaDescription: 'Calculadora de préstamos gratuita. Calcula los pagos mensuales, el interés total y el costo total de cualquier préstamo.',
    keywords: ['préstamo', 'hipoteca', 'pago', 'interés'],
    explanation: 'Esta calculadora de préstamos usa la fórmula de amortización estándar para calcular los pagos mensuales. La fórmula tiene en cuenta el monto principal, la tasa de interés anual y el plazo del préstamo.',
    faqs: [
      { question: '¿Cómo se calcula el pago mensual?', answer: 'Usando la fórmula de amortización: M = P × r(1+r)^n / ((1+r)^n - 1), donde P es el principal, r es la tasa mensual y n es el número de pagos.' },
    ],
  },
};

const es: Translation = {
  meta: {
    siteName: 'ToolVerse',
    title: 'ToolVerse — Calculadoras Online Gratis y Herramientas Inteligentes',
    description: 'ToolVerse ofrece más de 35 calculadoras online gratis y herramientas inteligentes — salud, finanzas, matemáticas, conversores de unidades, herramientas de PDF e imágenes, utilidades para desarrolladores y más. Rápidas, precisas y fáciles de usar.',
    keywords: 'calculadoras online, herramientas gratis, calculadora de salud, calculadora financiera, calculadora matemática, conversor de unidades, herramientas PDF, herramientas de imágenes, herramientas para desarrolladores',
  },
  nav: { categories: 'Categorías', search: 'Buscar herramientas', searchPlaceholder: 'Buscar herramientas...', searchResultsLabel: 'Resultados de búsqueda', language: 'Idioma' },
  home: {
    badge: (n: number) => `${n}+ herramientas gratis — sin registro`,
    heroTitle: 'Calculadoras Online Gratis',
    heroTitleAccent: 'y Herramientas Inteligentes',
    heroSubtitle: 'Calculadoras y utilidades rápidas, precisas y fáciles de usar para salud, finanzas, matemáticas y tareas diarias. Todas las herramientas funcionan en tu navegador — gratis, privado e instantáneo.',
    searchPlaceholder: 'Buscar una herramienta... (ej. IMC, préstamo, código QR)',
    searchButton: 'Buscar',
    noResults: 'No se encontraron herramientas. Prueba con otro término de búsqueda.',
    browseTitle: 'Explorar por Categoría',
    browseSubtitle: 'Explora nuestras herramientas organizadas por categoría',
    popularTitle: 'Herramientas Populares',
    recentlyAddedTitle: 'Añadidas Recientemente',
    faqTitle: 'Preguntas Frecuentes',
    toolCount: (count: number) => `${count} herramienta${count !== 1 ? 's' : ''}`,
  },
  category: { notFoundTitle: 'Categoría no encontrada', notFoundMessage: 'La categoría que buscas no existe.', otherCategoriesTitle: 'Otras Categorías', emptyMessage: 'Aún no hay herramientas en esta categoría. ¡Vuelve pronto!' },
  tool: { calculate: 'Calcular', reset: 'Reiniciar', aboutTitle: 'Acerca de', faqTitle: 'Preguntas Frecuentes', relatedTools: 'Herramientas Relacionadas', share: 'Compartir:', advertisement: 'Publicidad', errorRequired: 'Por favor, completa todos los campos obligatorios con valores válidos.', errorCalculation: 'Ocurrió un error durante el cálculo. Revisa tus datos.' },
  footer: { description: 'Calculadoras online gratis y herramientas inteligentes para tareas diarias. Rápidas, precisas y fáciles de usar.', categoriesTitle: 'Categorías', moreTitle: 'Más', companyTitle: 'Empresa', about: 'Acerca de', contact: 'Contacto', privacy: 'Política de Privacidad', terms: 'Términos', disclaimer: 'Aviso Legal', copyright: 'Todos los derechos reservados. Las herramientas son solo para fines informativos.' },
  newsletter: { title: 'Mantente Actualizado con Nuevas Herramientas', subtitle: 'Recibe notificaciones cuando añadamos nuevas calculadoras y herramientas. Sin spam, cancela cuando quieras.', placeholder: 'Introduce tu email', button: 'Suscribirse', success: '¡Gracias por suscribirte!' },
  faq: { defaultTitle: 'Preguntas Frecuentes' },
  share: { label: 'Compartir:', twitter: 'Compartir en Twitter', facebook: 'Compartir en Facebook', linkedin: 'Compartir en LinkedIn', copyLink: 'Copiar enlace', copied: '¡Copiado!' },
  notFound: { title: 'Página No Encontrada — ToolVerse', message: '¡Vaya! La página que buscas no existe.', backHome: 'Volver al Inicio' },
  cookieConsent: {
    title: 'Valoramos tu privacidad',
    message: 'Usamos cookies para mejorar tu experiencia, analizar el tráfico y mostrar anuncios relevantes. Puedes elegir qué cookies permitir.',
    accept: 'Aceptar todo',
    reject: 'Rechazar todo',
    customize: 'Personalizar',
    learnMore: 'Saber más',
    necessary: 'Necesarias',
    necessaryDesc: 'Cookies esenciales para el funcionamiento del sitio web. No se pueden desactivar.',
    analytics: 'Analíticas',
    analyticsDesc: 'Google Analytics para entender cómo los visitantes usan nuestro sitio.',
    advertising: 'Publicidad',
    advertisingDesc: 'Cookies de Google AdSense para mostrar anuncios personalizados.',
    save: 'Guardar preferencias',
  },
  staticPages: {
    aboutTitle: 'Acerca de ToolVerse',
    aboutBody: ['ToolVerse es una plataforma online gratuita que ofrece una colección creciente de calculadoras y herramientas inteligentes para uso diario.', 'Todas las herramientas funcionan directamente en tu navegador, garantizando que tus datos permanezcan privados.'],
    contactTitle: 'Contáctanos',
    contactBody: ['¿Tienes una pregunta o sugerencia? Escríbenos a hello@toolverse.app.'],
    privacyTitle: 'Política de Privacidad',
    privacyBody: ['ToolVerse respeta tu privacidad. Todos los cálculos se realizan localmente en tu navegador.', 'Usamos Google Analytics y AdSense que utilizan cookies. Puedes controlar tus preferencias de cookies en cualquier momento.'],
    termsTitle: 'Términos de Servicio',
    termsBody: ['Al usar ToolVerse, aceptas utilizar nuestras herramientas solo para fines lícitos. Las herramientas se proporcionan "tal cual" sin garantías de ningún tipo.'],
    disclaimerTitle: 'Aviso Legal',
    disclaimerBody: ['Las herramientas de ToolVerse son solo para fines informativos y educativos. No constituyen asesoramiento profesional.'],
  },
  categories: {
    'health-calculators': { name: 'Calculadoras de Salud', description: 'IMC, calorías, edad y otras calculadoras de bienestar.' },
    'finance-calculators': { name: 'Calculadoras Financieras', description: 'Préstamos, hipotecas, EMI y herramientas de dinero.' },
    'math-calculators': { name: 'Calculadoras Matemáticas', description: 'Porcentajes, proporciones y matemáticas diarias.' },
    'unit-converters': { name: 'Conversores de Unidades', description: 'Longitud, peso, temperatura y más.' },
    'time-date-tools': { name: 'Herramientas de Tiempo y Fecha', description: 'Fechas, duraciones y utilidades de tiempo.' },
    'pdf-tools': { name: 'Herramientas PDF', description: 'Fusionar, convertir y gestionar archivos PDF.' },
    'image-tools': { name: 'Herramientas de Imágenes', description: 'Comprimir, convertir y manejar imágenes.' },
    'text-tools': { name: 'Herramientas de Texto', description: 'Contar palabras, formatear y analizar texto.' },
    'developer-tools': { name: 'Herramientas para Desarrolladores', description: 'Contraseñas, códigos QR y utilidades de código.' },
    'everyday-calculators': { name: 'Calculadoras Diarias', description: 'Ayudas rápidas para tareas diarias.' },
  },
  tools: buildToolTranslations(),
};

export default es;
