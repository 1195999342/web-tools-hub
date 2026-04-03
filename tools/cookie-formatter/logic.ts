export function parseCookies(input: string): { key: string; value: string }[] {
  return input.split(';').map(s => s.trim()).filter(Boolean).map(pair => {
    const idx = pair.indexOf('=');
    if (idx < 0) return { key: pair, value: '' };
    return { key: pair.slice(0, idx).trim(), value: pair.slice(idx + 1).trim() };
  });
}
