// Monte Carlo Pi logic
export const TOOL_NAME = 'monte-carlo-pi';

export function runBatch(batchSize: number): { inside: number; total: number } {
  let inside = 0;
  for (let i = 0; i < batchSize; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) inside++;
  }
  return { inside, total: batchSize };
}

export function estimatePi(insideCount: number, totalCount: number): number {
  return (4 * insideCount) / totalCount;
}
