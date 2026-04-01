'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { getToolsByCategory, type ToolCategory } from '@/tools/registry';
import { locales } from '@/i18n';
import ToolCard from '@/components/ui/ToolCard';

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

export default function CategoryPage() {
  const params = useParams() as { locale: string; category: string };
  const { locale, category } = params;
  const t = useTranslations();

  const categoryKey = category as ToolCategory;
  if (!CATEGORIES.includes(categoryKey)) {
    notFound();
  }

  const tools = getToolsByCategory(categoryKey);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t(`categories.${categoryKey}`)}
      </h1>

      {tools.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 tablet:grid-cols-2 mobile:grid-cols-1">
          {tools.map((tool) => (
            <ToolCard
              key={tool.slug}
              tool={tool}
              locale={locale}
              href={`/${locale}/tools/${tool.slug}`}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p className="text-lg">{t('common.no_results')}</p>
        </div>
      )}
    </main>
  );
}
