'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getFeaturedTools, getEnabledTools, getToolsByCategory, type ToolCategory, type Locale } from '@/tools/registry';
import ToolCard from '@/components/ui/ToolCard';

interface HomePageProps {
  params: { locale: string };
}

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

export default function HomePage({ params }: HomePageProps) {
  const { locale } = params;
  const t = useTranslations();

  const featuredTools = getFeaturedTools();
  const enabledTools = getEnabledTools();
  const showCategoryFilter = enabledTools.length > 50;

  const toolsByCategory = CATEGORIES.map((cat) => ({
    category: cat,
    tools: getToolsByCategory(cat),
  })).filter(({ tools }) => tools.length > 0);

  const [activeCategory, setActiveCategory] = useState<ToolCategory | null>(null);

  const visibleCategories = activeCategory
    ? toolsByCategory.filter(({ category }) => category === activeCategory)
    : toolsByCategory;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Featured tools */}
      {featuredTools.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('common.all_tools')}
          </h2>
          <div className="grid grid-cols-3 gap-4 tablet:grid-cols-2 mobile:grid-cols-1">
            {featuredTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                locale={locale}
                href={`/${locale}/tools/${tool.slug}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Category filter (only shown when tool count > 50) */}
      {showCategoryFilter && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('common.all_tools')}
          </button>
          {toolsByCategory.map(({ category }) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      )}

      {/* Tools by category */}
      {visibleCategories.map(({ category, tools }) => (
        <section key={category} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {t(`categories.${category}`)}
            </h2>
            <Link
              href={`/${locale}/category/${category}`}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {t('common.all_tools')} →
            </Link>
          </div>
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
        </section>
      ))}

      {enabledTools.length === 0 && (
        <p className="text-center text-gray-500 py-20">{t('common.no_results')}</p>
      )}
    </div>
  );
}
