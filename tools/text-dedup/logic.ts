export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export interface DedupResult {
  text: string;
  originalCount: number;
  resultCount: number;
  removedCount: number;
}

export function dedup(text: string, caseSensitive: boolean): ToolResult<DedupResult> {
  try {
    const lines = text.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    return {
      output: {
        text: result.join('\n'),
        originalCount: lines.length,
        resultCount: result.length,
        removedCount: lines.length - result.length,
      },
    };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
