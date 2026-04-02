export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function formatXml(xml: string, indent: number = 2): ToolResult<string> {
  try {
    const sp = ' '.repeat(indent);
    let formatted = '';
    let depth = 0;
    const tokens = xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean);
    for (const token of tokens) {
      if (token.startsWith('</')) {
        depth = Math.max(0, depth - 1);
        formatted += sp.repeat(depth) + token + '\n';
      } else if (token.startsWith('<') && token.endsWith('/>')) {
        formatted += sp.repeat(depth) + token + '\n';
      } else if (token.startsWith('<?')) {
        formatted += token + '\n';
      } else if (token.startsWith('<![CDATA[')) {
        formatted += sp.repeat(depth) + token + '\n';
      } else if (token.startsWith('<!--')) {
        formatted += sp.repeat(depth) + token + '\n';
      } else if (token.startsWith('<')) {
        formatted += sp.repeat(depth) + token + '\n';
        depth++;
      } else {
        const trimmed = token.trim();
        if (trimmed) {
          formatted = formatted.trimEnd() + trimmed + '\n';
          // text node sits between open and close, don't increase depth
        }
      }
    }
    return { output: formatted.trim() };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function minifyXml(xml: string): ToolResult<string> {
  try {
    const result = xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
