export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function beautifyCss(code: string, indent: number = 2): ToolResult<string> {
  try {
    const sp = ' '.repeat(indent);
    let result = '';
    let depth = 0;
    let inString = false;
    let stringChar = '';
    for (let i = 0; i < code.length; i++) {
      const ch = code[i];
      if (inString) {
        result += ch;
        if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'") { inString = true; stringChar = ch; result += ch; continue; }
      if (ch === '{') {
        result = result.trimEnd() + ' {\n';
        depth++;
        result += sp.repeat(depth);
        continue;
      }
      if (ch === '}') {
        depth = Math.max(0, depth - 1);
        result = result.trimEnd() + '\n' + sp.repeat(depth) + '}\n' + sp.repeat(depth);
        continue;
      }
      if (ch === ';') {
        result += ';\n' + sp.repeat(depth);
        continue;
      }
      result += ch;
    }
    return { output: result.trim() };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function minifyCss(code: string): ToolResult<string> {
  try {
    let result = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
