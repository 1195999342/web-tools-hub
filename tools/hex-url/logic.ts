export function hexEncode(input: string): string {
  return Array.from(new TextEncoder().encode(input)).map(b => '%' + b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

export function hexDecode(input: string): string {
  const bytes = input.replace(/%/g, '').match(/.{2}/g)?.map(h => parseInt(h, 16)) ?? [];
  return new TextDecoder().decode(new Uint8Array(bytes));
}
