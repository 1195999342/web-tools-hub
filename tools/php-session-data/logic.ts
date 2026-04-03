export function parsePhpSessionData(input: string): { output?: string; error?: string } {
  try {
    const result: Record<string, string> = {};
    const regex = /(\w+)\|([^;]*;)/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      result[match[1]] = match[2];
    }
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) { return { error: (e as Error).message }; }
}
