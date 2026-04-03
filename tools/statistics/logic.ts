// Statistics Calculator logic
export const TOOL_NAME = 'statistics';

export interface Stats {
  count: number;
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stddev: number;
  min: number;
  max: number;
  sum: number;
}

export function calculate(nums: number[]): Stats | null {
  if (!nums.length) return null;
  const n = nums.length;
  const sorted = [...nums].sort((a, b) => a - b);
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = n % 2 === 1 ? sorted[Math.floor(n / 2)] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const freq = new Map<number, number>();
  nums.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
  const maxFreq = Math.max(...freq.values());
  const mode = maxFreq > 1 ? [...freq.entries()].filter(([, c]) => c === maxFreq).map(([v]) => v) : [];
  const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  return { count: n, mean, median, mode, variance, stddev: Math.sqrt(variance), min: sorted[0], max: sorted[n - 1], sum };
}
