export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function minifyJson(json: string): ToolResult<string> {
  try {
    const parsed = JSON.parse(json);
    return { output: JSON.stringify(parsed) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function escapeJson(json: string): ToolResult<string> {
  try {
    // Validate it's valid JSON first
    JSON.parse(json);
    // Escape: wrap the JSON string as a JSON string value
    return { output: JSON.stringify(json) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function unescapeJson(escaped: string): ToolResult<string> {
  try {
    const unescaped = JSON.parse(escaped);
    if (typeof unescaped !== 'string') {
      return { error: 'input_not_escaped_string' };
    }
    // Validate the unescaped result is valid JSON
    JSON.parse(unescaped);
    return { output: unescaped };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
