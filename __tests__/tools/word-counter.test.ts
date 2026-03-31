// Feature: web-tools-hub, Property 13: 字符统计正确性
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { countStats } from '../../tools/word-counter/index';

// --- Unit tests ---

describe('countStats unit tests', () => {
  test('empty string returns zeros', () => {
    const stats = countStats('');
    expect(stats.chars).toBe(0);
    expect(stats.words).toBe(0);
    expect(stats.lines).toBe(0);
  });

  test('whitespace-only string has 0 words', () => {
    const stats = countStats('   ');
    expect(stats.words).toBe(0);
    expect(stats.chars).toBe(3);
  });

  test('single word', () => {
    const stats = countStats('hello');
    expect(stats.chars).toBe(5);
    expect(stats.words).toBe(1);
    expect(stats.lines).toBe(1);
  });

  test('multiple words', () => {
    const stats = countStats('hello world foo');
    expect(stats.words).toBe(3);
  });

  test('multiline text', () => {
    const stats = countStats('line1\nline2\nline3');
    expect(stats.lines).toBe(3);
  });

  test('CJK characters counted correctly (Unicode-aware)', () => {
    const stats = countStats('你好世界');
    expect(stats.chars).toBe(4);
  });

  test('emoji counted as single character (Unicode-aware)', () => {
    const stats = countStats('😀😁');
    expect(stats.chars).toBe(2);
  });

  test('mixed CJK and ASCII', () => {
    const stats = countStats('hello 世界');
    expect(stats.chars).toBe(8); // 'hello ' = 6, '世界' = 2
    expect(stats.words).toBe(2);
  });
});

// --- Property 13: 字符统计正确性 ---
// Validates: Requirements 10.2
describe('P13: 字符统计正确性', () => {
  test('P13 property: chars equals Unicode character count', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const stats = countStats(text);
        expect(stats.chars).toBe([...text].length);
      }),
      { numRuns: 100 }
    );
  });

  test('P13 property: words equals non-empty tokens after whitespace split', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const stats = countStats(text);
        const expectedWords = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        expect(stats.words).toBe(expectedWords);
      }),
      { numRuns: 100 }
    );
  });

  test('P13 property: lines equals newline count + 1 (or 0 for empty)', () => {
    fc.assert(
      fc.property(fc.string(), (text) => {
        const stats = countStats(text);
        const expectedLines = text === '' ? 0 : text.split('\n').length;
        expect(stats.lines).toBe(expectedLines);
      }),
      { numRuns: 100 }
    );
  });
});
