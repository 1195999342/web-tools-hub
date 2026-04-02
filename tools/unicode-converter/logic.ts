export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function textToUnicode(text: string): ToolResult<string> {
  try {
    const result = Array.from(text)
      .map((ch) => {
        const code = ch.codePointAt(0)!;
        if (code > 0xffff) {
          return `\\u{${code.toString(16).toUpperCase()}}`;
        }
        return `\\u${code.toString(16).toUpperCase().padStart(4, '0')}`;
      })
      .join('');
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function unicodeToText(unicode: string): ToolResult<string> {
  try {
    const result = unicode.replace(
      /\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g,
      (_, p1, p2) => {
        const code = parseInt(p1 || p2, 16);
        return String.fromCodePoint(code);
      }
    );
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
