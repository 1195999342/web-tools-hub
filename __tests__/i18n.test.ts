// Feature: web-tools-hub, Property 6: 语言检测与偏好回退
// Feature: web-tools-hub, Property 7: 缺失翻译回退英文
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { detectLocaleFromHeader, getTranslationWithFallback, locales, defaultLocale } from '../lib/i18n';

// --- Unit tests ---

describe('detectLocaleFromHeader unit tests', () => {
  test('returns default locale for empty string', () => {
    expect(detectLocaleFromHeader('')).toBe('en');
  });

  test('exact match zh-CN', () => {
    expect(detectLocaleFromHeader('zh-CN')).toBe('zh-cn');
  });

  test('prefix match zh returns zh-cn', () => {
    const result = detectLocaleFromHeader('zh');
    expect(['zh-cn', 'zh-tw']).toContain(result);
  });

  test('quality-weighted selection', () => {
    const result = detectLocaleFromHeader('fr;q=0.9,en;q=0.8');
    expect(result).toBe('fr');
  });

  test('unsupported language falls back to en', () => {
    expect(detectLocaleFromHeader('xx-XX')).toBe('en');
  });

  test('locales array contains all 10 languages', () => {
    expect(locales).toHaveLength(10);
    expect(locales).toContain('en');
    expect(locales).toContain('zh-cn');
    expect(locales).toContain('ja');
  });
});

describe('getTranslationWithFallback unit tests', () => {
  const enMessages = { common: { hello: 'Hello', world: 'World' } };
  const frMessages = { common: { hello: 'Bonjour' } };

  test('returns translation from current locale', () => {
    expect(getTranslationWithFallback(frMessages, enMessages, 'common.hello')).toBe('Bonjour');
  });

  test('falls back to English when key missing in current locale', () => {
    expect(getTranslationWithFallback(frMessages, enMessages, 'common.world')).toBe('World');
  });

  test('returns key when missing in both locales', () => {
    expect(getTranslationWithFallback(frMessages, enMessages, 'common.missing')).toBe('common.missing');
  });
});

// --- Property 6: 语言检测与偏好回退 ---
// Validates: Requirements 6.4
describe('P6: 语言检测与偏好回退', () => {
  test('P6 property: detectLocaleFromHeader always returns a supported locale', () => {
    fc.assert(
      fc.property(fc.string(), (header) => {
        const result = detectLocaleFromHeader(header);
        expect(locales).toContain(result);
      }),
      { numRuns: 100 }
    );
  });

  test('P6 property: exact locale match is always detected', () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), (locale) => {
        const result = detectLocaleFromHeader(locale);
        expect(result).toBe(locale);
      }),
      { numRuns: 100 }
    );
  });
});

// --- Property 7: 缺失翻译回退英文 ---
// Validates: Requirements 6.5
describe('P7: 缺失翻译回退英文', () => {
  test('P7 property: missing translation never returns empty string', () => {
    const enMessages = { key: 'English value' };
    fc.assert(
      fc.property(
        fc.record({ key: fc.string({ minLength: 1 }) }),
        fc.string({ minLength: 1 }),
        (messages, key) => {
          const result = getTranslationWithFallback(messages, enMessages, key);
          expect(result.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
