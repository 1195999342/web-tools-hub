export function parseJSON(input: string): { data?: unknown; error?: string } {
  try {
    return { data: JSON.parse(input) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function isObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function isArray(val: unknown): val is unknown[] {
  return Array.isArray(val);
}

export function getType(val: unknown): string {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}
