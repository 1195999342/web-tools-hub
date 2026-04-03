export function cleanJSON(input: string): { output?: string; error?: string } {
  try {
    let s = input;
    // Remove single-line comments
    s = s.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    s = s.replace(/\/\*[\s\S]*?\*\//g, '');
    // Replace single quotes with double quotes (simple heuristic)
    s = s.replace(/'/g, '"');
    // Remove trailing commas before } or ]
    s = s.replace(/,\s*([\]}])/g, '$1');
    // Validate
    const parsed = JSON.parse(s);
    return { output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
