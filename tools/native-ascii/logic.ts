export function toAscii(input: string): string {
  return Array.from(input).map(c => {
    const code = c.codePointAt(0)!;
    return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : c;
  }).join('');
}

export function fromAscii(input: string): string {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}
