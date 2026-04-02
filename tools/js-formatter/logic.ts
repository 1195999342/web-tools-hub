export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function beautifyJs(code: string, indent: number = 2): ToolResult<string> {
  try {
    let depth = 0;
    const sp = ' '.repeat(indent);
    let result = '';
    let inString = false;
    let stringChar = '';
    let i = 0;
    while (i < code.length) {
      const ch = code[i];
      if (inString) {
        result += ch;
        if (ch === '\\') { result += code[++i] || ''; }
        else if (ch === stringChar) inString = false;
        i++; continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true; stringChar = ch; result += ch; i++; continue;
      }
      if (ch === '{' || ch === '[') {
        depth++;
        result += ch + '\n' + sp.repeat(depth);
        i++; continue;
      }
      if (ch === '}' || ch === ']') {
        depth = Math.max(0, depth - 1);
        result += '\n' + sp.repeat(depth) + ch;
        i++; continue;
      }
      if (ch === ',') {
        result += ch + '\n' + sp.repeat(depth);
        i++; continue;
      }
      if (ch === ';') {
        result += ch + '\n' + sp.repeat(depth);
        i++; continue;
      }
      result += ch; i++;
    }
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function minifyJs(code: string): ToolResult<string> {
  try {
    let result = '';
    let inString = false;
    let stringChar = '';
    let inLineComment = false;
    let inBlockComment = false;
    let i = 0;
    while (i < code.length) {
      if (inLineComment) {
        if (code[i] === '\n') inLineComment = false;
        i++; continue;
      }
      if (inBlockComment) {
        if (code[i] === '*' && code[i + 1] === '/') { inBlockComment = false; i += 2; }
        else i++;
        continue;
      }
      if (inString) {
        result += code[i];
        if (code[i] === '\\') { result += code[++i] || ''; }
        else if (code[i] === stringChar) inString = false;
        i++; continue;
      }
      if (code[i] === '/' && code[i + 1] === '/') { inLineComment = true; i += 2; continue; }
      if (code[i] === '/' && code[i + 1] === '*') { inBlockComment = true; i += 2; continue; }
      if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
        inString = true; stringChar = code[i]; result += code[i]; i++; continue;
      }
      if (/\s/.test(code[i])) {
        if (result.length > 0 && /\w/.test(result[result.length - 1]) && i + 1 < code.length && /\w/.test(code[i + 1])) {
          result += ' ';
        }
        i++; continue;
      }
      result += code[i]; i++;
    }
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
