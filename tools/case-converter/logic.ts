export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'toggle';

export function convertCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\b\w/g, (c) => c.toUpperCase());
    case 'sentence':
      return text.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
    case 'toggle':
      return Array.from(text)
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join('');
    default:
      return text;
  }
}
