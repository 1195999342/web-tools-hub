import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { getToolBySlug, getEnabledTools, type ToolMeta, type Locale } from '@/tools/registry';
import { locales } from '@/i18n';
import { generateToolSeo } from '@/lib/seo';
import ToolErrorBoundary from '@/components/ToolErrorBoundary';
import ToolJsonLd from '@/components/seo/ToolJsonLd';
import HreflangTags from '@/components/seo/HreflangTags';

// Loading skeleton shown while tool components are being loaded
function ToolSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse" aria-busy="true" aria-label="Loading tool">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-gray-200 rounded" />
          <div className="h-7 w-48 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-72 bg-gray-200 rounded mt-2" />
      </div>
      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-40 bg-gray-200 rounded-md" />
        <div className="h-10 w-32 bg-gray-200 rounded-md" />
        <div className="h-40 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
}

// Dynamic component cache to avoid recreating dynamic imports on re-renders
const toolComponentCache = new Map<string, React.ComponentType<{ locale: string; toolMeta: ToolMeta }>>();

function getToolComponent(slug: string): React.ComponentType<{ locale: string; toolMeta: ToolMeta }> | null {
  if (toolComponentCache.has(slug)) {
    return toolComponentCache.get(slug)!;
  }

  // Map of known tool slugs to their dynamic imports
  const toolImportMap: Record<string, () => Promise<{ default: React.ComponentType<{ locale: string; toolMeta: ToolMeta }> }>> = {
    'json-formatter': () => import('@/tools/json-formatter/index'),
    'word-counter': () => import('@/tools/word-counter/index'),
    'base64': () => import('@/tools/base64/index'),
    'url-encoder': () => import('@/tools/url-encoder/index'),
    'timestamp': () => import('@/tools/timestamp/index'),
    'json-minify': () => import('@/tools/json-minify/index'),
    'uuid-generator': () => import('@/tools/uuid-generator/index'),
    'hash-calculator': () => import('@/tools/hash-calculator/index'),
    'color-converter': () => import('@/tools/color-converter/index'),
    'radix-converter': () => import('@/tools/radix-converter/index'),
    'case-converter': () => import('@/tools/case-converter/index'),
    'password-generator': () => import('@/tools/password-generator/index'),
    'json-sort': () => import('@/tools/json-sort/index'),
    'regex-tester': () => import('@/tools/regex-tester/index'),
    'qrcode': () => import('@/tools/qrcode/index'),
    'json-converter': () => import('@/tools/json-converter/index'),
    'json-to-class': () => import('@/tools/json-to-class/index'),
    'jwt-decoder': () => import('@/tools/jwt-decoder/index'),
    'json-schema': () => import('@/tools/json-schema/index'),
    'unicode-converter': () => import('@/tools/unicode-converter/index'),
    'symmetric-cipher': () => import('@/tools/symmetric-cipher/index'),
    'html-escape': () => import('@/tools/html-escape/index'),
    'file-base64': () => import('@/tools/file-base64/index'),
    'text-dedup': () => import('@/tools/text-dedup/index'),
    'text-sort': () => import('@/tools/text-sort/index'),
    'text-trim': () => import('@/tools/text-trim/index'),
    'naming-converter': () => import('@/tools/naming-converter/index'),
    'js-formatter': () => import('@/tools/js-formatter/index'),
    'css-formatter': () => import('@/tools/css-formatter/index'),
    'sql-formatter': () => import('@/tools/sql-formatter/index'),
    'xml-formatter': () => import('@/tools/xml-formatter/index'),
    'properties-yaml': () => import('@/tools/properties-yaml/index'),
    'json-to-sql': () => import('@/tools/json-to-sql/index'),
    'diff-viewer': () => import('@/tools/diff-viewer/index'),
    'markdown-editor': () => import('@/tools/markdown-editor/index'),
    'cron-generator': () => import('@/tools/cron-generator/index'),
    'unit-converter': () => import('@/tools/unit-converter/index'),
    'filesize-converter': () => import('@/tools/filesize-converter/index'),
    'random-number': () => import('@/tools/random-number/index'),
    'php-serialize': () => import('@/tools/php-serialize/index'),
  };

  const importFn = toolImportMap[slug];
  if (!importFn) {
    return null;
  }

  const DynamicComponent = dynamic(importFn, {
    loading: () => <ToolSkeleton />,
    ssr: true,
  });

  toolComponentCache.set(slug, DynamicComponent);
  return DynamicComponent;
}

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
  const seo = generateToolSeo(tool, locale as Locale);
  const alternates: Record<string, string> = {};
  for (const entry of seo.hreflangUrls) {
    if (entry.locale !== 'x-default') {
      alternates[entry.locale] = entry.href;
    }
  }
  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.ogMeta['og:title'],
      description: seo.ogMeta['og:description'],
      type: 'website',
      url: seo.ogMeta['og:url'],
      locale: seo.ogMeta['og:locale'],
    },
    twitter: {
      card: 'summary',
      title: seo.twitterMeta['twitter:title'],
      description: seo.twitterMeta['twitter:description'],
    },
    alternates: {
      canonical: seo.canonicalUrl,
      languages: alternates,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = getToolComponent(slug);
  const seo = generateToolSeo(tool, locale as Locale);

  return (
    <>
      <ToolJsonLd jsonLd={seo.jsonLd} />
      <HreflangTags entries={seo.hreflangUrls} />
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
    </>
  );
}
