// GCD & LCM logic
export const TOOL_NAME = 'gcd-lcm';

function gcd2(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm2(a: number, b: number): number {
  return a && b ? Math.abs(a) / gcd2(a, b) * Math.abs(b) : 0;
}

export function gcd(nums: number[]): number {
  return nums.reduce((a, b) => gcd2(a, b));
}

export function lcm(nums: number[]): number {
  return nums.reduce((a, b) => lcm2(a, b));
}
