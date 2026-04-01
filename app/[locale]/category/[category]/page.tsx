import CategoryPageClient from './CategoryPageClient';
import { locales } from '@/i18n';
import type { ToolCategory } from '@/tools/registry';

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of locales) {
    for (const category of CATEGORIES) {
      params.push({ locale, category });
    }
  }
  return params;
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
