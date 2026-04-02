export function formatPython(code: string, indentSize: number = 4): string {
  const lines = code.split('\n');
  let indent = 0;
  const result: string[] = [];
  const indentStr = ' '.repeat(indentSize);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { result.push(''); continue; }
    if (/^(else|elif|except|finally|except\s)/.test(trimmed) || trimmed === 'else:' || trimmed.startsWith('elif ') || trimmed.startsWith('except') || trimmed.startsWith('finally')) {
      indent = Math.max(0, indent - 1);
    }
    result.push(indentStr.repeat(indent) + trimmed);
    if (trimmed.endsWith(':') && !trimmed.startsWith('#')) indent++;
  }
  return result.join('\n');
}
