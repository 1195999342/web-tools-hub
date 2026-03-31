import { Locale } from '../tools/registry';

export const locales: Locale[] = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'];
export const defaultLocale: Locale = 'en';

/**
 * Parse an Accept-Language header and return the best matching supported locale.
 * Falls back to 'en' if no match is found.
 *
 * Example header: "zh-CN,zh;q=0.9,en;q=0.8"
 */
export function detectLocaleFromHeader(acceptLanguage: string): Locale {
  if (!acceptLanguage || typeof acceptLanguage !== 'string') {
    return defaultLocale;
  }

  // Parse each language tag with its quality value
  const entries = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';');
      const quality = q ? parseFloat(q.replace('q=', '').trim()) : 1.0;
      return { tag: tag.trim(), quality: isNaN(quality) ? 1.0 : quality };
    })
    .filter((e) => e.tag.length > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of entries) {
    // Exact match first (e.g. "zh-CN" matches "zh-CN")
    const exact = locales.find((l) => l.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;

    // Prefix match (e.g. "zh" matches "zh-CN" then "zh-TW")
    const prefix = tag.split('-')[0].toLowerCase();
    const prefixMatch = locales.find((l) => l.toLowerCase().startsWith(prefix + '-') || l.toLowerCase() === prefix);
    if (prefixMatch) return prefixMatch;
  }

  return defaultLocale;
}

/**
 * Resolve a dot-notation key against a nested messages object.
 * Returns undefined if the key path doesn't exist.
 */
function resolveKey(messages: Record<string, unknown>, key: string): string | undefined {
  const parts = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = messages;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Get a translation by dot-notation key with fallback to English.
 * Priority: current locale messages → English messages → key itself (never empty).
 */
export function getTranslationWithFallback(
  messages: Record<string, unknown>,
  englishMessages: Record<string, unknown>,
  key: string
): string {
  const value = resolveKey(messages, key);
  if (value !== undefined) return value;

  const fallback = resolveKey(englishMessages, key);
  if (fallback !== undefined) return fallback;

  return key;
}
