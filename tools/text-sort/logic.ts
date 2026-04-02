export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export type SortMode = 'alpha' | 'numeric' | 'length' | 'random';

export function sortLines(text: string, mode: SortMode, descending: boolean): ToolResult<string> {
  try {
    const lines = text.split('\n');
    let sorted: string[];
    switch (mode) {
      case 'alpha':
        sorted = [...lines].sort((a, b) => a.localeCompare(b));
        break;
      case 'numeric':
        sorted = [...lines].sort((a, b) => {
          const na = parseFloat(a) || 0;
          const nb = parseFloat(b) || 0;
          return na - nb;
        });
        break;
      case 'length':
        sorted = [...lines].sort((a, b) => a.length - b.length);
        break;
      case 'random':
        sorted = [...lines].sort(() => Math.random() - 0.5);
        break;
      default:
        sorted = lines;
    }
    if (descending && mode !== 'random') sorted.reverse();
    return { output: sorted.join('\n') };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
