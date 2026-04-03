// Fibonacci logic
export const TOOL_NAME = 'fibonacci';

export function generateFibonacci(n: number): string[] {
  if (n <= 0) return [];
  const seq: bigint[] = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) seq.push(0n);
    else if (i === 1) seq.push(1n);
    else seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq.map(v => v.toString());
}
