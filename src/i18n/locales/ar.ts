import type { Translation } from '../types';
import { getAllTools } from '../../data/toolRegistry';

function buildToolTranslations(): Translation['tools'] {
  const tools: Translation['tools'] = {};
  for (const tool of getAllTools()) {
    const tr = arTools[tool.slug];
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

const arTools: Translation['tools'] = {
  'bmi-calculator': {
    title: 'حاسبة مؤشر كتلة الجسم',
    description: 'احسب مؤشر كتلة الجسم (BMI) لتحديد ما إذا كان وزنك في نطاق صحي.',
    metaDescription: 'حاسبة مؤشر كتلة الجسم مجانية. احسب مؤشر كتلة الجسم فوراً. اكتشف ما إذا كان وزنك صحياً لطولك.',
    keywords: ['مؤشر كتلة الجسم', 'الوزن', 'الصحة'],
    explanation: 'مؤشر كتلة الجسم (BMI) هو مقياس لدهون الجسم يعتمد على الوزن والطول. يُستخدم على نطاق واسع كأداة فحص لتحديد ما إذا كان البالغون يعانون من نقص الوزن أو وزن طبيعي أو زيادة في الوزن أو سمنة. مؤشر كتلة الجسم = الوزن(كجم) / الطول(م)².',
    faqs: [
      { question: 'ما هو النطاق الصحي لمؤشر كتلة الجسم؟', answer: 'يُعتبر مؤشر كتلة الجسم بين 18.5 و24.9 صحياً لمعظم البالغين.' },
      { question: 'هل مؤشر كتلة الجسم دقيق للرياضيين؟', answer: 'قد يبالغ مؤشر كتلة الجسم في تقدير دهون الجسم لدى الرياضيين ذوي الكتلة العضلية العالية. إنها أداة فحص عامة وليست تشخيصاً.' },
    ],
  },
  'percentage-calculator': {
    title: 'حاسبة النسبة المئوية',
    description: 'احسب النسب المئوية والزيادات والنقصانات والمزيد.',
    metaDescription: 'حاسبة النسبة المئوية مجانية. احسب ما هو X% من Y، والزيادة/النقصان بالنسبة المئوية والمزيد.',
    keywords: ['نسبة مئوية', 'نسبة', 'رياضيات'],
    explanation: 'النسبة المئوية هي رقم أو نسبة معبر عنها ككسر من 100. تجد هذه الحاسبة النسبة المئوية التي يمثلها قيمة من أخرى.',
    faqs: [
      { question: 'كيف أحسب نسبة مئوية؟', answer: 'اقسم القيمة على الإجمالي واضرب في 100. على سبيل المثال، 50/200 × 100 = 25%.' },
    ],
  },
  'loan-calculator': {
    title: 'حاسبة القروض',
    description: 'احسب الدفعات الشهرية للقرض وإجمالي الفائدة والتكلفة الإجمالية.',
    metaDescription: 'حاسبة قروض مجانية. احسب الدفعات الشهرية وإجمالي الفائدة والتكلفة الإجمالية لأي مبلغ قرض.',
    keywords: ['قرض', 'رهن عقاري', 'دفع', 'فائدة'],
    explanation: 'تستخدم حاسبة القروض هذه صيغة الإهلاك القياسية لحساب الدفعات الشهرية. تأخذ الصيغة في الاعتبار المبلغ الأساسي وسعر الفائدة السنوي ومدة القرض.',
    faqs: [
      { question: 'كيف يتم حساب الدفع الشهري؟', answer: 'باستخدام صيغة الإهلاك: M = P × r(1+r)^n / ((1+r)^n - 1)، حيث P هو المبلغ الأساسي و r هو السعر الشهري و n هو عدد الدفعات.' },
    ],
  },
};

const ar: Translation = {
  meta: {
    siteName: 'ToolVerse',
    title: 'ToolVerse — حاسبات مجانية عبر الإنترنت وأدوات ذكية',
    description: 'يقدم ToolVerse أكثر من 35 حاسبة مجانية عبر الإنترنت وأدوات ذكية — الصحة والمالية والرياضيات ومحولات الوحدات وأدوات PDF والصور ومرافق المطورين والمزيد. سريعة ودقيقة وسهلة الاستخدام.',
    keywords: 'حاسبات عبر الإنترنت, أدوات مجانية, حاسبة صحية, حاسبة مالية, حاسبة رياضية, محول وحدات, أدوات PDF, أدوات الصور, أدوات المطورين',
  },
  nav: { categories: 'الفئات', search: 'البحث عن أدوات', searchPlaceholder: 'ابحث عن أدوات...', searchResultsLabel: 'نتائج البحث', language: 'اللغة' },
  home: {
    badge: (n: number) => `${n}+ أداة مجانية — بدون تسجيل`,
    heroTitle: 'حاسبات مجانية عبر الإنترنت',
    heroTitleAccent: 'وأدوات ذكية',
    heroSubtitle: 'حاسبات ومرافق سريعة ودقيقة وسهلة الاستخدام للصحة والمالية والرياضيات والمهام اليومية. تعمل جميع الأدوات مباشرة في متصفحك — مجانية وخاصة وفورية.',
    searchPlaceholder: 'ابحث عن أداة... (مثل: مؤشر كتلة الجسم، قرض، رمز QR)',
    searchButton: 'بحث',
    noResults: 'لم يتم العثور على أدوات. جرب مصطلح بحث آخر.',
    browseTitle: 'تصفح حسب الفئة',
    browseSubtitle: 'استكشف أدواتنا المنظمة حسب الفئة',
    popularTitle: 'أدوات شائعة',
    recentlyAddedTitle: 'أضيفت مؤخراً',
    faqTitle: 'الأسئلة الشائعة',
    toolCount: (count: number) => `${count} أداة`,
  },
  category: { notFoundTitle: 'الفئة غير موجودة', notFoundMessage: 'الفئة التي تبحث عنها غير موجودة.', otherCategoriesTitle: 'فئات أخرى', emptyMessage: 'لا توجد أدوات في هذه الفئة بعد. تحقق قريباً!' },
  tool: { calculate: 'احسب', reset: 'إعادة تعيين', aboutTitle: 'حول', faqTitle: 'الأسئلة الشائعة', relatedTools: 'أدوات ذات صلة', share: 'مشاركة:', advertisement: 'إعلان', errorRequired: 'يرجى ملء جميع الحقول المطلوبة بقيم صالحة.', errorCalculation: 'حدث خطأ أثناء الحساب. يرجى التحقق من المدخلات.' },
  footer: { description: 'حاسبات مجانية عبر الإنترنت وأدوات ذكية للمهام اليومية. سريعة ودقيقة وسهلة الاستخدام.', categoriesTitle: 'الفئات', moreTitle: 'المزيد', companyTitle: 'الشركة', about: 'حول', contact: 'اتصل بنا', privacy: 'سياسة الخصوصية', terms: 'الشروط', disclaimer: 'إخلاء المسؤولية', copyright: 'جميع الحقوق محفوظة. الأدوات لأغراض معلوماتية فقط.' },
  newsletter: { title: 'ابق على اطلاع بالأدوات الجديدة', subtitle: 'احصل على إشعار عندما نضيف حاسبات وأدوات جديدة. لا رسائل مزعجة، يمكنك إلغاء الاشتراك في أي وقت.', placeholder: 'أدخل بريدك الإلكتروني', button: 'اشترك', success: 'شكراً لاشتراكك!' },
  faq: { defaultTitle: 'الأسئلة الشائعة' },
  share: { label: 'مشاركة:', twitter: 'شارك على تويتر', facebook: 'شارك على فيسبوك', linkedin: 'شارك على لينكدإن', copyLink: 'نسخ الرابط', copied: 'تم النسخ!' },
  notFound: { title: 'الصفحة غير موجودة — ToolVerse', message: 'عذراً! الصفحة التي تبحث عنها غير موجودة.', backHome: 'العودة إلى الرئيسية' },
  cookieConsent: {
    title: 'نحن نقدر خصوصيتك',
    message: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة المرور وعرض إعلانات ذات صلة. يمكنك اختيار ملفات تعريف الارتباط التي تسمح بها.',
    accept: 'قبول الكل',
    reject: 'رفض الكل',
    customize: 'تخصيص',
    learnMore: 'معرفة المزيد',
    necessary: 'ضرورية',
    necessaryDesc: 'ملفات تعريف الارتباط الأساسية لعمل الموقع. لا يمكن تعطيلها.',
    analytics: 'التحليلات',
    analyticsDesc: 'Google Analytics لفهم كيفية استخدام الزوار لموقعنا.',
    advertising: 'الإعلانات',
    advertisingDesc: 'ملفات تعريف الارتباط من Google AdSense لعرض إعلانات مخصصة.',
    save: 'حفظ التفضيلات',
  },
  staticPages: {
    aboutTitle: 'حول ToolVerse',
    aboutBody: ['ToolVerse هو منصة مجانية عبر الإنترنت تقدم مجموعة متزايدة من الحاسبات والأدوات الذكية للاستخدام اليومي.', 'تعمل جميع الأدوات مباشرة في متصفحك، مما يضمن بقاء بياناتك خاصة.'],
    contactTitle: 'اتصل بنا',
    contactBody: ['هل لديك سؤال أو اقتراح؟ راسلنا على hello@toolverse.app.'],
    privacyTitle: 'سياسة الخصوصية',
    privacyBody: ['يحترم ToolVerse خصوصيتك. تتم جميع الحسابات محلياً في متصفحك.', 'نستخدم Google Analytics و AdSense التي تستخدم ملفات تعريف الارتباط. يمكنك التحكم في تفضيلات ملفات تعريف الارتباط في أي وقت.'],
    termsTitle: 'شروط الخدمة',
    termsBody: ['باستخدام ToolVerse، فإنك توافق على استخدام أدواتنا لأغراض مشروعة فقط. يتم توفير الأدوات "كما هي" دون أي ضمانات.'],
    disclaimerTitle: 'إخلاء المسؤولية',
    disclaimerBody: ['أدوات ToolVerse مخصصة لأغراض معلوماتية وتعليمية فقط. وهي لا تشكل استشارة مهنية.'],
  },
  categories: {
    'health-calculators': { name: 'حاسبات الصحة', description: 'مؤشر كتلة الجسم والسعرات الحرارية والعمر وحاسبات صحية أخرى.' },
    'finance-calculators': { name: 'الحاسبات المالية', description: 'القروض والرهون العقارية والأقساط وأدوات مالية.' },
    'math-calculators': { name: 'حاسبات الرياضيات', description: 'النسب المئوية والنسب والرياضيات اليومية.' },
    'unit-converters': { name: 'محولات الوحدات', description: 'الطول والوزن ودرجة الحرارة والمزيد.' },
    'time-date-tools': { name: 'أدوات الوقت والتاريخ', description: 'التواريخ والمدد ومرافق الوقت.' },
    'pdf-tools': { name: 'أدوات PDF', description: 'دمج وتحويل وإدارة ملفات PDF.' },
    'image-tools': { name: 'أدوات الصور', description: 'ضغط وتحويل ومعالجة الصور.' },
    'text-tools': { name: 'أدوات النص', description: 'عد الكلمات وتنسيق وتحليل النص.' },
    'developer-tools': { name: 'أدوات المطورين', description: 'كلمات المرور ورموز QR ومرافق البرمجة.' },
    'everyday-calculators': { name: 'حاسبات يومية', description: 'مساعدات سريعة للمهام اليومية.' },
  },
  tools: buildToolTranslations(),
};

export default ar;
