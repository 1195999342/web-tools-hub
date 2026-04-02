export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function generatePassword(options: PasswordOptions): string {
  let chars = '';
  if (options.uppercase) chars += UPPER;
  if (options.lowercase) chars += LOWER;
  if (options.digits) chars += DIGITS;
  if (options.symbols) chars += SYMBOLS;
  if (!chars) chars = LOWER + DIGITS;
  const len = Math.max(4, Math.min(options.length, 128));
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => chars[v % chars.length]).join('');
}

export function generateBatch(count: number, options: PasswordOptions): string[] {
  const clamped = Math.max(1, Math.min(count, 100));
  return Array.from({ length: clamped }, () => generatePassword(options));
}

export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

export function evaluateStrength(password: string): StrengthLevel {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score <= 2) return 'fair';
  if (score <= 3) return 'good';
  return 'strong';
}
