export async function computeFileHash(file: File, algorithm: string): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hash = await crypto.subtle.digest(algorithm, buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
