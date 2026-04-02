export interface ToolResult<T> {
  output?: T;
  error?: string;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password).buffer as ArrayBuffer, 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export async function aesEncrypt(plaintext: string, password: string): Promise<ToolResult<string>> {
  try {
    if (!password) return { error: 'Password is required' };
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(password, salt);
    const enc = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv: iv.buffer as ArrayBuffer }, key, enc.encode(plaintext).buffer as ArrayBuffer
    );
    const result = toHex(salt) + ':' + toHex(iv) + ':' + toHex(encrypted);
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function aesDecrypt(ciphertext: string, password: string): Promise<ToolResult<string>> {
  try {
    if (!password) return { error: 'Password is required' };
    const parts = ciphertext.split(':');
    if (parts.length !== 3) return { error: 'Invalid ciphertext format' };
    const salt = fromHex(parts[0]);
    const iv = fromHex(parts[1]);
    const data = fromHex(parts[2]);
    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-CBC', iv: iv.buffer as ArrayBuffer }, key, data.buffer as ArrayBuffer
    );
    return { output: new TextDecoder().decode(decrypted) };
  } catch {
    return { error: 'Decryption failed. Check password and ciphertext.' };
  }
}
