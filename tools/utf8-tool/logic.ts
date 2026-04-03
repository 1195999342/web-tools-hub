export function textToUtf8Bytes(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

export function utf8BytesToText(input: string): string {
  const hex = input.replace(/[^0-9a-fA-F]/g, '');
  const bytes = hex.match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? [];
  return new TextDecoder().decode(new Uint8Array(bytes));
}
