const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function base32Encode(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = '', result = '';
  for (const b of bytes) bits += b.toString(2).padStart(8, '0');
  while (bits.length % 5) bits += '0';
  for (let i = 0; i < bits.length; i += 5) result += B32[parseInt(bits.slice(i, i + 5), 2)];
  while (result.length % 8) result += '=';
  return result;
}

export function base32Decode(input: string): string {
  const s = input.replace(/=+$/, '');
  let bits = '';
  for (const c of s) { const i = B32.indexOf(c.toUpperCase()); if (i < 0) throw new Error('Invalid'); bits += i.toString(2).padStart(5, '0'); }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function baseEncode(input: string, alphabet: string): string {
  let bytes = Array.from(new TextEncoder().encode(input));
  let result = '';
  const base = alphabet.length;
  while (bytes.some(b => b > 0)) {
    let carry = 0;
    const next: number[] = [];
    for (const b of bytes) { carry = carry * 256 + b; next.push(Math.floor(carry / base)); carry %= base; }
    bytes = next;
    while (bytes.length > 0 && bytes[0] === 0) bytes.shift();
    result = alphabet[carry] + result;
  }
  return result || alphabet[0];
}

function baseDecode(input: string, alphabet: string): string {
  const base = alphabet.length;
  let bytes: number[] = [0];
  for (const c of input) {
    const val = alphabet.indexOf(c);
    if (val < 0) throw new Error('Invalid character');
    for (let i = 0; i < bytes.length; i++) bytes[i] = bytes[i] * base;
    bytes[bytes.length - 1] += val;
    for (let i = bytes.length - 1; i > 0; i--) { bytes[i - 1] += Math.floor(bytes[i] / 256); bytes[i] %= 256; }
    if (bytes[0] >= 256) { bytes.unshift(Math.floor(bytes[0] / 256)); bytes[1] %= 256; }
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function base58Encode(input: string): string { return baseEncode(input, B58); }
export function base58Decode(input: string): string { return baseDecode(input, B58); }
export function base62Encode(input: string): string { return baseEncode(input, B62); }
export function base62Decode(input: string): string { return baseDecode(input, B62); }
