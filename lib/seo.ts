import { type ToolMeta, type ToolCategory, type Locale } from '@/tools/registry';
import { locales } from '@/i18n';

// --- Types ---

export interface HreflangEntry {
  locale: string;
  href: string;
}

export interface WebApplicationJsonLd {
  '@context': 'https://schema.org';
  '@type': 'WebApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: 'Any';
  offers: { '@type': 'Offer'; price: '0'; priceCurrency: 'USD' };
}

export interface OpenGraphMeta {
  'og:title': string;
  'og:description': string;
  'og:type': string;
  'og:url': string;
  'og:locale': string;
}

export interface TwitterCardMeta {
  'twitter:card': 'summary';
  'twitter:title': string;
  'twitter:description': string;
}

export interface ToolSeoData {
  title: string;
  description: string;
  canonicalUrl: string;
  hreflangUrls: HreflangEntry[];
  jsonLd: WebApplicationJsonLd;
  ogMeta: OpenGraphMeta;
  twitterMeta: TwitterCardMeta;
}

// --- Category display names (simple mapping for SEO title, not i18n) ---

const CATEGORY_DISPLAY_NAMES: Record<ToolCategory, string> = {
  text: 'Text',
  json: 'JSON',
  encoding: 'Encoding',
  color: 'Color',
  network: 'Network',
  math: 'Math',
  converter: 'Converter',
  formatter: 'Formatter',
  image: 'Image',
  css: 'CSS',
  misc: 'Misc',
};

// --- Locale to OG locale mapping ---

const OG_LOCALE_MAP: Record<Locale, string> = {
  en: 'en_US',
  'zh-cn': 'zh_CN',
  'zh-tw': 'zh_TW',
  ja: 'ja_JP',
  ko: 'ko_KR',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
  ru: 'ru_RU',
};

// --- Main generation function ---

const DEFAULT_SITE_URL = 'https://webtools.dev';

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
}

export function generateToolSeo(tool: ToolMeta, locale: Locale, siteUrl?: string): ToolSeoData {
  const base = siteUrl || getSiteUrl();
  const l = (tool.supportedLocales.includes(locale) ? locale : 'en') as Locale;
  const name = tool.name[l];
  const description = tool.description[l];
  const categoryDisplay = CATEGORY_DISPLAY_NAMES[tool.category];
  const title = `${name} - ${categoryDisplay} | Web Tools Hub`;
  const canonicalUrl = `${base}/${locale}/tools/${tool.slug}/`;

  const hreflangUrls: HreflangEntry[] = locales.map((loc) => ({
    locale: loc,
    href: `${base}/${loc}/tools/${tool.slug}/`,
  }));
  // x-default points to English version
  hreflangUrls.push({
    locale: 'x-default',
    href: `${base}/en/tools/${tool.slug}/`,
  });

  const jsonLd: WebApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: canonicalUrl,
    applicationCategory: categoryDisplay,
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const ogMeta: OpenGraphMeta = {
    'og:title': title,
    'og:description': description,
    'og:type': 'website',
    'og:url': canonicalUrl,
    'og:locale': OG_LOCALE_MAP[locale] || 'en_US',
  };

  const twitterMeta: TwitterCardMeta = {
    'twitter:card': 'summary',
    'twitter:title': title,
    'twitter:description': description,
  };

  return {
    title,
    description,
    canonicalUrl,
    hreflangUrls,
    jsonLd,
    ogMeta,
    twitterMeta,
  };
}
