export interface NumberStats {
  sum: number;
  count: number;
  avg: number;
  min: number;
  max: number;
  numbers: number[];
}

export function sumNumbers(input: string): NumberStats {
  const numbers = input.split(/[\n,;\s]+/).map(l => l.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n));
  if (numbers.length === 0) return { sum: 0, count: 0, avg: 0, min: 0, max: 0, numbers: [] };
  const sum = numbers.reduce((a, b) => a + b, 0);
  return {
    sum,
    count: numbers.length,
    avg: sum / numbers.length,
    min: Math.min(...numbers),
    max: Math.max(...numbers),
    numbers,
  };
}
