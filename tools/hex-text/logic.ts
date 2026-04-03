export function textToHex(input: string): string {
  return Array.from(new TextEncoder().encode(input)).map(b => b.toString(16).padStart(2, '0')).join(' ');
}
export function hexToText(input: string): string {
  const hex = input.replace(/[^0-9a-fA-F]/g, '');
  const bytes = hex.match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? [];
  return new TextDecoder().decode(new Uint8Array(bytes));
}
