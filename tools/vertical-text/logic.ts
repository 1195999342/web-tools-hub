export function toVertical(input: string): string {
  const lines = input.split('\n');
  const maxLen = Math.max(...lines.map(l => [...l].length));
  const result: string[] = [];
  for (let col = 0; col < maxLen; col++) {
    result.push(lines.map(line => [...line][col] || '　').join(''));
  }
  return result.join('\n');
}
