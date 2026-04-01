'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getToolsByCategory, type ToolCategory } from '@/tools/registry';
import ToolCard from '@/components/ui/ToolCard';

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

export default function CategoryPageClient() {
  const params = useParams() as { locale: string; category: string };
  const { locale, category } = params;
  const t = useTranslations();

  const categoryKey = category as ToolCategory;
  const tools = CATEGORIES.includes(categoryKey) ? getToolsByCategory(categoryKey) : [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {CATEGORIES.includes(categoryKey) ? t(`categories.${categoryKey}`) : 'Not Found'}
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
