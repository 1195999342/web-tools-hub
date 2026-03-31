// Feature: web-tools-hub, Property 9: 搜索结果相关性
// Feature: web-tools-hub, Property 10: 搜索索引与注册表同步
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { createSearchEngine } from '../lib/search';
import { TOOL_REGISTRY, type ToolMeta, type Locale, type ToolCategory } from '../tools/registry';

const LOCALES: Locale[] = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'];
const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

const localeArb = fc.constantFrom(...LOCALES);
const categoryArb = fc.constantFrom(...CATEGORIES);
const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 50 });

const localeRecordArb = fc.record(
  Object.fromEntries(LOCALES.map((l) => [l, nonEmptyStringArb])) as Record<Locale, fc.Arbitrary<string>>
) as fc.Arbitrary<Record<Locale, string>>;

const toolMetaArb: fc.Arbitrary<ToolMeta> = fc.record({
  slug: fc.stringMatching(/^[a-z][a-z0-9-]{0,20}$/),
  icon: nonEmptyStringArb,
  category: categoryArb,
  enabled: fc.boolean(),
  featured: fc.option(fc.boolean(), { nil: undefined }),
  supportedLocales: fc.uniqueArray(localeArb, { minLength: 1 }),
  name: localeRecordArb,
  description: localeRecordArb,
});

// --- Unit tests ---

describe('createSearchEngine unit tests', () => {
  test('empty query returns all enabled tools', () => {
    const engine = createSearchEngine(TOOL_REGISTRY, 'en');
    const results = engine.search('');
    const enabledCount = TOOL_REGISTRY.filter((t) => t.enabled).length;
    expect(results.length).toBe(enabledCount);
  });

  test('search for known tool name returns that tool', () => {
    const engine = createSearchEngine(TOOL_REGISTRY, 'en');
    const results = engine.search('JSON');
    expect(results.some((r) => r.tool.slug === 'json-formatter')).toBe(true);
  });

  test('rebuild updates the index', () => {
    const engine = createSearchEngine(TOOL_REGISTRY, 'en');
    engine.rebuild([]);
    const results = engine.search('');
    expect(results.length).toBe(0);
  });

  test('disabled tools do not appear in results', () => {
    const disabledTool: ToolMeta = {
      ...TOOL_REGISTRY[0],
      slug: 'disabled-tool',
      enabled: false,
    };
    const engine = createSearchEngine([...TOOL_REGISTRY, disabledTool], 'en');
    const results = engine.search('');
    expect(results.every((r) => r.tool.slug !== 'disabled-tool')).toBe(true);
  });
});

// --- Property 9: 搜索结果相关性 ---
// Validates: Requirements 8.1
describe('P9: 搜索结果相关性', () => {
  test('P9 property: empty query returns all enabled tools', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(toolMetaArb, { minLength: 1, maxLength: 10, selector: (t) => t.slug }),
        localeArb,
        (tools, locale) => {
          const engine = createSearchEngine(tools, locale);
          const results = engine.search('');
          const enabledCount = tools.filter((t) => t.enabled).length;
          expect(results.length).toBe(enabledCount);
        }
      ),
      { numRuns: 50 }
    );
  });
});

// --- Property 10: 搜索索引与注册表同步 ---
// Validates: Requirements 8.5
describe('P10: 搜索索引与注册表同步', () => {
  test('P10 property: after rebuild, disabled tools never appear in results', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(toolMetaArb, { minLength: 1, maxLength: 10, selector: (t) => t.slug }),
        localeArb,
        (tools, locale) => {
          const engine = createSearchEngine([], locale);
          engine.rebuild(tools);
          const results = engine.search('');
          const disabledSlugs = new Set(tools.filter((t) => !t.enabled).map((t) => t.slug));
          for (const r of results) {
            expect(disabledSlugs.has(r.tool.slug)).toBe(false);
          }
        }
      ),
      { numRuns: 50 }
    );
  });
});
