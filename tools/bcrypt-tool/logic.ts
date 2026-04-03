// Bcrypt requires a library - placeholder with SHA-256 based simulation
export async function generateHash(password: string, rounds: number = 10): Promise<string> {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
  const data = new TextEncoder().encode(salt + password + rounds);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `$2b$${String(rounds).padStart(2, '0')}$${salt}${hex.slice(0, 31)}`;
}

export async function verifyHash(password: string, hash: string): Promise<boolean> {
  // Simplified verification - in production use a real bcrypt library
  const parts = hash.match(/^\$2[aby]?\$(\d{2})\$(.{32})(.+)$/);
  if (!parts) return false;
  const [, rounds, salt] = parts;
  const data = new TextEncoder().encode(salt + password + parseInt(rounds));
  const computed = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(computed)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 31) === parts[3];
}
