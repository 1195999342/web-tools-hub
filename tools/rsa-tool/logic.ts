export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['encrypt', 'decrypt']
  );
  const pub = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const priv = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  return {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${arrayBufferToBase64(pub)}\n-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN PRIVATE KEY-----\n${arrayBufferToBase64(priv)}\n-----END PRIVATE KEY-----`,
  };
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary);
  return b64.match(/.{1,64}/g)?.join('\n') ?? b64;
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const clean = b64.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function rsaEncrypt(plaintext: string, publicKeyPem: string): Promise<string> {
  const keyData = base64ToArrayBuffer(publicKeyPem);
  const key = await crypto.subtle.importKey('spki', keyData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, new TextEncoder().encode(plaintext));
  const bytes = new Uint8Array(encrypted);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

export async function rsaDecrypt(ciphertext: string, privateKeyPem: string): Promise<string> {
  const keyData = base64ToArrayBuffer(privateKeyPem);
  const key = await crypto.subtle.importKey('pkcs8', keyData, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['decrypt']);
  const binary = atob(ciphertext);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, key, bytes.buffer);
  return new TextDecoder().decode(decrypted);
}
