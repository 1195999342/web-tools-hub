export function parsePhpSession(input: string): { output?: string; error?: string } {
  try {
    const result: Record<string, string> = {};
    const parts = input.split(';').filter(Boolean);
    for (const part of parts) {
      const match = part.match(/^(\w+)\|(.+)/);
      if (match) result[match[1]] = match[2];
    }
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) { return { error: (e as Error).message }; }
}
