// Decimal Random logic
export const TOOL_NAME = 'decimal-random';

export function generateRandom(min: number, max: number, decimals: number, count: number): string[] {
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    const val = Math.random() * (max - min) + min;
    results.push(val.toFixed(decimals));
  }
  return results;
}
