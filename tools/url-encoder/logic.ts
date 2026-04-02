export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export type UrlEncodeMode = 'component' | 'uri';

export function urlEncode(text: string, mode: UrlEncodeMode): ToolResult<string> {
  try {
    const output = mode === 'component' ? encodeURIComponent(text) : encodeURI(text);
    return { output };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function urlDecode(text: string, mode: UrlEncodeMode): ToolResult<string> {
  try {
    const output = mode === 'component' ? decodeURIComponent(text) : decodeURI(text);
    return { output };
  } catch {
    return { error: 'invalid_encoded_string' };
  }
}
