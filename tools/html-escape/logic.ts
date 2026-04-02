export interface ToolResult<T> {
  output?: T;
  error?: string;
}

const ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

const REVERSE: Record<string, string> = {};
for (const [k, v] of Object.entries(ENTITIES)) REVERSE[v] = k;

export function escapeHtml(text: string): ToolResult<string> {
  try {
    const output = text.replace(/[&<>"']/g, (ch) => ENTITIES[ch] || ch);
    return { output };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function unescapeHtml(text: string): ToolResult<string> {
  try {
    const output = text
      .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x[0-9a-fA-F]+;|&#\d+;/g, (entity) => {
        if (REVERSE[entity]) return REVERSE[entity];
        if (entity.startsWith('&#x')) return String.fromCodePoint(parseInt(entity.slice(3, -1), 16));
        if (entity.startsWith('&#')) return String.fromCodePoint(parseInt(entity.slice(2, -1), 10));
        return entity;
      });
    return { output };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
