export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export type NamingStyle = 'camel' | 'pascal' | 'snake' | 'kebab' | 'screaming';

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function convertNaming(input: string, style: NamingStyle): ToolResult<string> {
  try {
    const words = splitWords(input);
    if (words.length === 0) return { output: '' };
    let output: string;
    switch (style) {
      case 'camel':
        output = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      case 'pascal':
        output = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        break;
      case 'snake':
        output = words.map((w) => w.toLowerCase()).join('_');
        break;
      case 'kebab':
        output = words.map((w) => w.toLowerCase()).join('-');
        break;
      case 'screaming':
        output = words.map((w) => w.toUpperCase()).join('_');
        break;
      default:
        output = input;
    }
    return { output };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
