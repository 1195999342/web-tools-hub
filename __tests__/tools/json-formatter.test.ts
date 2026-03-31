// Feature: web-tools-hub, Property 12: JSON 格式化 round-trip
import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { formatJson } from '../../tools/json-formatter/index';

// --- Unit tests ---

describe('formatJson unit tests', () => {
  test('empty string returns empty output', () => {
    const result = formatJson('');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('');
  });

  test('whitespace-only string returns empty output', () => {
    const result = formatJson('   ');
    expect(result.error).toBeUndefined();
    expect(result.output).toBe('');
  });

  test('valid JSON object is formatted', () => {
    const result = formatJson('{"a":1}');
    expect(result.error).toBeUndefined();
    expect(result.output).toBeDefined();
    expect(JSON.parse(result.output!)).toEqual({ a: 1 });
  });

  test('invalid JSON returns error', () => {
    const result = formatJson('{invalid}');
    expect(result.error).toBeDefined();
    expect(result.output).toBeUndefined();
  });

  test('deeply nested object is formatted correctly', () => {
    const deep = { a: { b: { c: { d: 42 } } } };
    const result = formatJson(JSON.stringify(deep));
    expect(result.error).toBeUndefined();
    expect(JSON.parse(result.output!)).toEqual(deep);
  });

  test('JSON array is formatted correctly', () => {
    const result = formatJson('[1,2,3]');
    expect(result.error).toBeUndefined();
    expect(JSON.parse(result.output!)).toEqual([1, 2, 3]);
  });
});

// --- Property 12: JSON 格式化 round-trip ---
// Validates: Requirements 10.1
describe('P12: JSON 格式化 round-trip', () => {
  test('P12 property: valid JSON round-trips correctly', () => {
    // Note: JSON.stringify(-0) === "0", so -0 round-trips to 0 per JSON spec.
    // We use JSON-serializable equality: compare via JSON.stringify to match JSON semantics.
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const input = JSON.stringify(value);
        const result = formatJson(input);
        expect(result.error).toBeUndefined();
        // Compare using JSON round-trip equality (handles -0 === 0 in JSON)
        expect(JSON.stringify(JSON.parse(result.output!))).toBe(JSON.stringify(JSON.parse(input)));
      }),
      { numRuns: 100 }
    );
  });

  test('P12 property: invalid JSON never throws, always returns error', () => {
    // Generate strings that are not valid JSON
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => {
          try {
            JSON.parse(s);
            return false;
          } catch {
            return true;
          }
        }),
        (invalidJson) => {
          let threw = false;
          let result;
          try {
            result = formatJson(invalidJson);
          } catch {
            threw = true;
          }
          expect(threw).toBe(false);
          expect(result?.error).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
