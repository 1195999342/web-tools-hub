export function parseNames(input: string): string[] {
  return input.split('\n').map(s => s.trim()).filter(Boolean);
}

export function pickRandom(names: string[]): string | null {
  if (names.length === 0) return null;
  return names[Math.floor(Math.random() * names.length)];
}
