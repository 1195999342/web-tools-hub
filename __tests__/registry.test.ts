// Feature: web-tools-hub, Property 1: 注册表条目完整性
// Feature: web-tools-hub, Property 4: 重复 slug 检测
// Feature: web-tools-hub, Property 14: 注册表纯数据性
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  TOOL_REGISTRY,
  getToolBySlug,
  getEnabledTools,
  getToolsByCategory,
  getFeaturedTools,
  validateRegistry,
  type ToolMeta,
  type Locale,
  type ToolCategory,
} from '../tools/registry';

const LOCALES: Locale[] = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'es', 'fr', 'de', 'pt', 'ru'];
const CATEGORIES: ToolCategory[] = ['text', 'json', 'encoding', 'color', 'network', 'math', 'misc'];

// Arbitraries
const localeArb = fc.constantFrom(...LOCALES);
const categoryArb = fc.constantFrom(...CATEGORIES);
const slugArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,30}$/);
const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 50 });

const localeRecordArb = fc.record(
  Object.fromEntries(LOCALES.map((l) => [l, nonEmptyStringArb])) as Record<Locale, fc.Arbitrary<string>>
) as fc.Arbitrary<Record<Locale, string>>;

const toolMetaArb: fc.Arbitrary<ToolMeta> = fc.record({
  slug: slugArb,
  icon: nonEmptyStringArb,
  category: categoryArb,
  enabled: fc.boolean(),
  featured: fc.option(fc.boolean(), { nil: undefined }),
  supportedLocales: fc.uniqueArray(localeArb, { minLength: 1 }),
  name: localeRecordArb,
  description: localeRecordArb,
});

// --- Unit tests ---

describe('TOOL_REGISTRY unit tests', () => {
  test('registry has at least one tool', () => {
    expect(TOOL_REGISTRY.length).toBeGreaterThan(0);
  });

  test('getToolBySlug returns correct tool', () => {
    const tool = getToolBySlug('json-formatter');
    expect(tool).toBeDefined();
    expect(tool?.slug).toBe('json-formatter');
  });

  test('getToolBySlug returns undefined for unknown slug', () => {
    expect(getToolBySlug('nonexistent-tool')).toBeUndefined();
  });

  test('getEnabledTools returns only enabled tools', () => {
    const enabled = getEnabledTools();
    expect(enabled.every((t) => t.enabled)).toBe(true);
  });

  test('getFeaturedTools returns only featured+enabled tools', () => {
    const featured = getFeaturedTools();
    expect(featured.every((t) => t.featured === true && t.enabled)).toBe(true);
  });

  test('getToolsByCategory returns tools of correct category', () => {
    const jsonTools = getToolsByCategory('json');
    expect(jsonTools.every((t) => t.category === 'json' && t.enabled)).toBe(true);
  });

  test('validateRegistry throws on duplicate slugs', () => {
    const tool = TOOL_REGISTRY[0];
    expect(() => validateRegistry([tool, tool])).toThrow();
  });

  test('validateRegistry passes for unique slugs', () => {
    expect(() => validateRegistry(TOOL_REGISTRY)).not.toThrow();
  });
});

// --- Property 1: 注册表条目完整性 ---
// Validates: Requirements 1.1, 6.6
describe('P1: 注册表条目完整性', () => {
  test('TOOL_REGISTRY entries have all required fields with non-empty locale strings', () => {
    for (const tool of TOOL_REGISTRY) {
      expect(typeof tool.slug).toBe('string');
      expect(tool.slug.length).toBeGreaterThan(0);
      expect(typeof tool.icon).toBe('string');
      expect(typeof tool.category).toBe('string');
      expect(typeof tool.enabled).toBe('boolean');
      expect(Array.isArray(tool.supportedLocales)).toBe(true);
      expect(tool.supportedLocales.length).toBeGreaterThan(0);
      for (const locale of tool.supportedLocales) {
        expect(tool.name[locale]).toBeTruthy();
        expect(tool.description[locale]).toBeTruthy();
      }
    }
  });

  test('P1 property: arbitrary tool entries have non-empty name/description for supported locales', () => {
    fc.assert(
      fc.property(toolMetaArb, (tool) => {
        for (const locale of tool.supportedLocales) {
          expect(tool.name[locale].length).toBeGreaterThan(0);
          expect(tool.description[locale].length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });
});

// --- Property 4: 重复 slug 检测 ---
// Validates: Requirements 1.4
describe('P4: 重复 slug 检测', () => {
  test('P4 property: validateRegistry throws when duplicate slugs exist', () => {
    fc.assert(
      fc.property(
        toolMetaArb,
        fc.array(toolMetaArb, { minLength: 0, maxLength: 5 }),
        (tool, others) => {
          const withDuplicate = [tool, ...others, { ...tool }];
          expect(() => validateRegistry(withDuplicate)).toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('P4 property: validateRegistry passes when all slugs are unique', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(toolMetaArb, {
          minLength: 1,
          maxLength: 10,
          selector: (t) => t.slug,
        }),
        (tools) => {
          expect(() => validateRegistry(tools)).not.toThrow();
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 14: 注册表纯数据性 ---
// Validates: Requirements 11.3
describe('P14: 注册表纯数据性', () => {
  test('P14 property: all TOOL_REGISTRY fields are primitive types', () => {
    fc.assert(
      fc.property(toolMetaArb, (tool) => {
        expect(typeof tool.slug).toBe('string');
        expect(typeof tool.icon).toBe('string');
        expect(typeof tool.category).toBe('string');
        expect(typeof tool.enabled).toBe('boolean');
        expect(Array.isArray(tool.supportedLocales)).toBe(true);
        expect(tool.supportedLocales.every((l) => typeof l === 'string')).toBe(true);
        // name and description are Record<string, string>
        for (const v of Object.values(tool.name)) {
          expect(typeof v).toBe('string');
        }
        for (const v of Object.values(tool.description)) {
          expect(typeof v).toBe('string');
        }
        // No functions or class instances
        expect(typeof tool.slug).not.toBe('function');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect((tool.slug as any) instanceof Promise).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});
