export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' | 'MD5';

export async function computeHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  const data = new TextEncoder().encode(text);
  if (algorithm === 'MD5') {
    return md5(data);
  }
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Minimal pure-JS MD5 implementation
function md5(input: Uint8Array): string {
  function leftRotate(x: number, c: number) {
    return (x << c) | (x >>> (32 - c));
  }

  const s = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21,
  ];

  const K: number[] = [];
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(2 ** 32 * Math.abs(Math.sin(i + 1)));
  }

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  // Pre-processing: add padding
  const bitLen = input.length * 8;
  const padded: number[] = Array.from(input);
  padded.push(0x80);
  while (padded.length % 64 !== 56) padded.push(0);
  // Append original length in bits as 64-bit little-endian
  for (let i = 0; i < 8; i++) {
    padded.push((bitLen >>> (i * 8)) & 0xff);
  }

  // Process each 512-bit chunk
  for (let offset = 0; offset < padded.length; offset += 64) {
    const M: number[] = [];
    for (let j = 0; j < 16; j++) {
      M[j] =
        padded[offset + j * 4] |
        (padded[offset + j * 4 + 1] << 8) |
        (padded[offset + j * 4 + 2] << 16) |
        (padded[offset + j * 4 + 3] << 24);
    }

    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + K[i] + M[g]) | 0;
      A = D; D = C; C = B; B = (B + leftRotate(F, s[i])) | 0;
    }
    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }

  // Output as hex (little-endian)
  function toHex(n: number) {
    return Array.from({ length: 4 }, (_, i) => ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, '0')).join('');
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}
