export function generateRandomChinese(count: number): string {
  const chars: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = 0x4e00 + Math.floor(Math.random() * (0x9fff - 0x4e00));
    chars.push(String.fromCodePoint(code));
  }
  return chars.join('');
}
