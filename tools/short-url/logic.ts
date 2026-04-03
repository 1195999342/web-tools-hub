const B62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export function encodeBase62(num: number): string {
  if (num === 0) return B62[0];
  let r = '';
  while (num > 0) { r = B62[num % 62] + r; num = Math.floor(num / 62); }
  return r;
}
export function decodeBase62(str: string): number {
  let r = 0;
  for (const c of str) { r = r * 62 + B62.indexOf(c); }
  return r;
}
export function simulateShorten(url: string): string {
  let hash = 0;
  for (const c of url) hash = ((hash << 5) - hash + c.charCodeAt(0)) | 0;
  return encodeBase62(Math.abs(hash));
}
