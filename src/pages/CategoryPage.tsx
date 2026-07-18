import { localizePath, Link } from '../utils/router';
import { categoryMap, categories } from '../data/categories';
import { getToolsByCategory } from '../data/toolRegistry';
import { useCategorySeo, usePageMeta } from '../utils/seo';
import { useI18n, useLocalizedCategory, useLocalizedTool } from '../i18n';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';
import type { Category } from '../data/categories';
import type { Tool } from '../data/toolRegistry';
import type { Locale } from '../i18n/config';

function OtherCategoryLink({ category, locale }: { category: Category; locale: Locale }) {
  const localizedCat = useLocalizedCategory(category);
  return (
    <Link
      to={localizePath(`/category/${category.id}`, locale)}
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:text-brand-600"
    >
      {localizedCat.name}
    </Link>
  );
}

function LocalizedToolCard({ tool, locale }: { tool: Tool; locale: Locale }) {
  const localizedTool = useLocalizedTool(tool);
  return <ToolCard tool={localizedTool} locale={locale} />;
}

export default function CategoryPage({ categoryId }: { categoryId: string }) {
  const { locale, t } = useI18n();
  const cat = categoryMap[categoryId];
  const localizedCat = useLocalizedCategory(cat);
  useCategorySeo(categoryId);
  usePageMeta(
    cat ? `${localizedCat.name} — ${t.meta.siteName}` : `${t.category.notFoundTitle} — ${t.meta.siteName}`,
    cat ? localizedCat.description : t.category.notFoundMessage,
    `/category/${categoryId}`,
  );

  if (!cat) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t.category.notFoundTitle}</h1>
        <p className="mt-2 text-slate-500">{t.category.notFoundMessage}</p>
      </div>
    );
  }

  const tools = getToolsByCategory(categoryId);

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[
        { label: 'Home', to: localizePath('/', locale) },
        { label: localizedCat.name },
      ]} />

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <cat.icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{localizedCat.name}</h1>
          <p className="text-slate-500">{localizedCat.description}</p>
        </div>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <LocalizedToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-slate-500">{t.category.emptyMessage}</p>
        </div>
      )}

      {/* Other categories */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-slate-900">{t.category.otherCategoriesTitle}</h2>
        <div className="flex flex-wrap gap-3">
          {categories.filter((c) => c.id !== categoryId).map((c) => (
            <OtherCategoryLink key={c.id} category={c} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
