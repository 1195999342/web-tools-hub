import { MetadataRoute } from 'next';
import { getEnabledTools, type ToolCategory } from '@/tools/registry';
import { locales } from '@/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://web-tools-hub.com';

const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // Category pages
  for (const category of CATEGORIES) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  // Tool pages
  for (const tool of getEnabledTools()) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return entries;
}
