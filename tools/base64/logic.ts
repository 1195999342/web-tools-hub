export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function encode(text: string): ToolResult<string> {
  try {
    const bytes = new TextEncoder().encode(text);
    const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
    return { output: btoa(binary) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function decode(base64: string): ToolResult<string> {
  try {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return { output: new TextDecoder().decode(bytes) };
  } catch {
    return { error: 'invalid_base64' };
  }
}

export function encodeUrlSafe(text: string): ToolResult<string> {
  const result = encode(text);
  if (result.error) return result;
  return { output: result.output!.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') };
}

export function decodeUrlSafe(base64: string): ToolResult<string> {
  try {
    let standard = base64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = standard.length % 4;
    if (pad) standard += '='.repeat(4 - pad);
    return decode(standard);
  } catch {
    return { error: 'invalid_base64' };
  }
}
