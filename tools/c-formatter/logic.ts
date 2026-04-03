export function formatCCode(code: string): string {
  let indent = 0;
  const lines = code.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
    const result = '  '.repeat(indent) + trimmed;
    if (trimmed.endsWith('{')) indent++;
    return result;
  }).join('\n');
}
