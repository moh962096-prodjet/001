import { Link, localizePath } from '../utils/router';
import { categories } from '../data/categories';
import { useI18n, useLocalizedCategory } from '../i18n';
import { Calculator } from 'lucide-react';
import type { Category } from '../data/categories';
import type { Locale } from '../i18n/config';

function FooterCategoryLink({ category, locale }: { category: Category; locale: Locale }) {
  const localizedCat = useLocalizedCategory(category);
  return (
    <li>
      <Link to={localizePath(`/category/${category.id}`, locale)} className="text-sm text-slate-500 transition hover:text-brand-600">
        {localizedCat.name}
      </Link>
    </li>
  );
}

export default function Footer() {
  const { locale, t } = useI18n();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2">
            <Link to={localizePath('/', locale)} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Calculator className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">ToolVerse</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t.footer.categoriesTitle}</h3>
            <ul className="mt-3 space-y-2">
              {categories.slice(0, 5).map((c) => (
                <FooterCategoryLink key={c.id} category={c} locale={locale} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t.footer.moreTitle}</h3>
            <ul className="mt-3 space-y-2">
              {categories.slice(5).map((c) => (
                <FooterCategoryLink key={c.id} category={c} locale={locale} />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">{t.footer.companyTitle}</h3>
            <ul className="mt-3 space-y-2">
              <li><Link to={localizePath('/about', locale)} className="text-sm text-slate-500 transition hover:text-brand-600">{t.footer.about}</Link></li>
              <li><Link to={localizePath('/contact', locale)} className="text-sm text-slate-500 transition hover:text-brand-600">{t.footer.contact}</Link></li>
              <li><Link to={localizePath('/privacy', locale)} className="text-sm text-slate-500 transition hover:text-brand-600">{t.footer.privacy}</Link></li>
              <li><Link to={localizePath('/terms', locale)} className="text-sm text-slate-500 transition hover:text-brand-600">{t.footer.terms}</Link></li>
              <li><Link to={localizePath('/disclaimer', locale)} className="text-sm text-slate-500 transition hover:text-brand-600">{t.footer.disclaimer}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-6">
          <p className="text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} {t.meta.siteName}. {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
