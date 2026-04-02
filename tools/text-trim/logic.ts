export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export type TrimMode = 'remove-empty' | 'trim-whitespace' | 'merge-blank' | 'join-one-line';

export function trimText(text: string, mode: TrimMode): ToolResult<string> {
  try {
    let output: string;
    switch (mode) {
      case 'remove-empty':
        output = text.split('\n').filter((l) => l.trim() !== '').join('\n');
        break;
      case 'trim-whitespace':
        output = text.split('\n').map((l) => l.trim()).join('\n');
        break;
      case 'merge-blank':
        output = text.replace(/\n{3,}/g, '\n\n');
        break;
      case 'join-one-line':
        output = text.split('\n').map((l) => l.trim()).filter((l) => l !== '').join(' ');
        break;
      default:
        output = text;
    }
    return { output };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
