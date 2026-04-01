import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getToolsByCategory, type ToolCategory } from '@/tools/registry';
import { locales } from '@/i18n';

import ToolCard from '@/components/ui/ToolCard';const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>;
}

export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of locales) {
    for (const category of CATEGORIES) {
      params.push({ locale, category });
    }
  }
  return params;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });
  const categoryKey = category as ToolCategory;
  if (!CATEGORIES.includes(categoryKey)) return {};
  return {
    title: t(categoryKey),
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;
  const t = await getTranslations();

  const categoryKey = category as ToolCategory;
  if (!CATEGORIES.includes(categoryKey)) notFound();

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
