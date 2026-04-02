export type SortOrder = 'asc' | 'desc';

export interface SortResult {
  output?: string;
  error?: string;
}

export function sortJsonKeys(jsonStr: string, order: SortOrder = 'asc'): SortResult {
  try {
    const parsed = JSON.parse(jsonStr);
    const sorted = deepSortKeys(parsed, order);
    return { output: JSON.stringify(sorted, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function deepSortKeys(value: unknown, order: SortOrder): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => deepSortKeys(item, order));
  }
  if (value !== null && typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>).sort((a, b) =>
      order === 'asc' ? a.localeCompare(b) : b.localeCompare(a),
    );
    const result: Record<string, unknown> = {};
    for (const key of keys) {
      result[key] = deepSortKeys((value as Record<string, unknown>)[key], order);
    }
    return result;
  }
  return value;
}
