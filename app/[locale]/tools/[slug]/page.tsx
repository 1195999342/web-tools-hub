import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getToolBySlug, getEnabledTools, type Locale } from '@/tools/registry';
import { locales } from '@/i18n';
import ToolErrorBoundary from '@/components/ToolErrorBoundary';
import JsonFormatter from '@/tools/json-formatter/index';
import WordCounter from '@/tools/word-counter/index';

// Tool component registry - add new tools here
const TOOL_COMPONENTS: Record<string, React.ComponentType<{ locale: string; toolMeta: any }>> = {
  'json-formatter': JsonFormatter,
  'word-counter': WordCounter,
};

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  const enabledTools = getEnabledTools();
  const params: { locale: string; slug: string }[] = [];
  for (const tool of enabledTools) {
    for (const locale of locales) {
      params.push({ locale, slug: tool.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  const l = (tool.supportedLocales.includes(locale as Locale) ? locale : 'en') as Locale;
  return {
    title: tool.name[l],
    description: tool.description[l],
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const l = (tool.supportedLocales.includes(locale as Locale) ? locale : 'en') as Locale;

  const ToolComponent = TOOL_COMPONENTS[slug];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <ToolErrorBoundary>
        {ToolComponent ? (
          <ToolComponent locale={locale} toolMeta={tool} />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>This tool is coming soon.</p>
          </div>
        )}
      </ToolErrorBoundary>
    </main>
  );
}
