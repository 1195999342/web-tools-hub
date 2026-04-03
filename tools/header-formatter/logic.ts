export function parseHeaders(input: string): { key: string; value: string }[] {
  return input.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
    const idx = line.indexOf(':');
    if (idx < 0) return { key: line, value: '' };
    return { key: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
  });
}
