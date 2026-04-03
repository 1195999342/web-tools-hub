// Binary Calculator logic
export const TOOL_NAME = 'binary-calc';

export function parseBin(s: string): number | null {
  if (!/^[01]+$/.test(s.trim())) return null;
  return parseInt(s.trim(), 2);
}

export type BinOp = 'AND' | 'OR' | 'XOR' | 'NOT_A' | '+' | '-' | '*';

export function binaryCalc(a: string, b: string, op: BinOp): string | null {
  const na = parseBin(a);
  if (na === null) return null;
  if (op === 'NOT_A') return (na ^ ((1 << a.trim().length) - 1)).toString(2);
  const nb = parseBin(b);
  if (nb === null) return null;
  let r: number;
  switch (op) {
    case 'AND': r = na & nb; break;
    case 'OR': r = na | nb; break;
    case 'XOR': r = na ^ nb; break;
    case '+': r = na + nb; break;
    case '-': r = na - nb; break;
    case '*': r = na * nb; break;
    default: return null;
  }
  return r < 0 ? '-' + Math.abs(r).toString(2) : r.toString(2);
}
