// Radix Calculator logic
export const TOOL_NAME = 'radix-calc';

export function parseNumber(value: string, radix: number): number | null {
  const n = parseInt(value, radix);
  return isNaN(n) ? null : n;
}

export type Op = '+' | '-' | '*' | '/' | '%';

export function calc(a: number, b: number, op: Op): number | null {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : Math.trunc(a / b);
    case '%': return b === 0 ? null : a % b;
  }
}

export function toAllBases(n: number) {
  return {
    bin: n.toString(2),
    oct: n.toString(8),
    dec: n.toString(10),
    hex: n.toString(16).toUpperCase(),
  };
}
