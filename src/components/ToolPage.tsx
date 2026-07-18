import { useState, useEffect } from 'react';
import type { Tool, ToolResult } from '../data/toolRegistry';
import { categoryMap } from '../data/categories';
import { getToolsByCategory } from '../data/toolRegistry';
import { useToolSeo } from '../utils/seo';
import { useI18n, useLocalizedTool } from '../i18n';
import { localizePath } from '../utils/router';
import Breadcrumbs from './Breadcrumbs';
import ToolForm from './ToolForm';
import ResultDisplay from './ResultDisplay';
import Faq from './Faq';
import ShareButtons from './ShareButtons';
import ToolCard from './ToolCard';
import { Info } from 'lucide-react';
import type { Tool as ToolType } from '../data/toolRegistry';
import type { Locale } from '../i18n/config';

import TextCaseConverter from './tools/TextCaseConverter';
import RemoveDuplicateLines from './tools/RemoveDuplicateLines';
import TextSorter from './tools/TextSorter';
import TextReverser from './tools/TextReverser';
import MarkdownPreviewer from './tools/MarkdownPreviewer';
import PdfSplitter from './tools/PdfSplitter';
import PdfPageExtractor from './tools/PdfPageExtractor';
import ImageResizer from './tools/ImageResizer';
import ImageCropper from './tools/ImageCropper';
import ImageFormatConverter from './tools/ImageFormatConverter';

const customComponents: Record<string, React.ComponentType> = {
  'text-case-converter': TextCaseConverter,
  'remove-duplicate-lines': RemoveDuplicateLines,
  'text-sorter': TextSorter,
  'text-reverser': TextReverser,
  'markdown-previewer': MarkdownPreviewer,
  'pdf-splitter': PdfSplitter,
  'pdf-page-extractor': PdfPageExtractor,
  'image-resizer': ImageResizer,
  'image-cropper': ImageCropper,
  'image-format-converter': ImageFormatConverter,
};

function LocalizedToolCard({ tool, locale }: { tool: ToolType; locale: Locale }) {
  const localizedTool = useLocalizedTool(tool);
  return <ToolCard tool={localizedTool} locale={locale} />;
}

export default function ToolPage({ tool }: { tool: Tool }) {
  const { locale, t } = useI18n();
  const localizedTool = useLocalizedTool(tool);
  const [result, setResult] = useState<ToolResult | null>(null);
  useToolSeo(tool);
  const path = `/tools/${tool.slug}`;
  const cat = categoryMap[tool.category];
  const localizedCat = cat;

  useEffect(() => {
    setResult(null);
  }, [tool.slug]);

  const related = getToolsByCategory(tool.category).filter((t) => t.slug !== tool.slug).slice(0, 3);
  const CustomComponent = tool.custom ? customComponents[tool.slug] : null;

  return (
    <div className="container-page py-8">
      <Breadcrumbs items={[
        { label: 'Home', to: localizePath('/', locale) },
        { label: localizedCat?.name ?? tool.category, to: localizePath(`/category/${tool.category}`, locale) },
        { label: localizedTool.title },
      ]} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="mb-6">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              {cat && <cat.icon className="h-7 w-7" />}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{localizedTool.title}</h1>
            <p className="mt-2 text-slate-500">{localizedTool.description}</p>
          </div>

          {CustomComponent ? <CustomComponent /> : <ToolForm tool={tool} onResult={setResult} />}

          {result && !tool.custom && (
            <div className="mt-6">
              <ResultDisplay result={result} />
            </div>
          )}

          <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">{t.tool.aboutTitle} {localizedTool.title}</h2>
            </div>
            <p className="mt-3 leading-relaxed text-slate-600">{localizedTool.explanation}</p>
          </section>

          <Faq items={localizedTool.faqs} title={`${localizedTool.title} — ${t.tool.faqTitle}`} />

          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            <ShareButtons title={localizedTool.title} path={localizePath(path, locale)} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
            {t.tool.advertisement}
          </div>
          {related.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{t.tool.relatedTools}</h3>
              <div className="space-y-3">
                {related.map((r) => (
                  <LocalizedToolCard key={r.slug} tool={r} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
