export function sumNumbers(input: string): { sum: number; count: number; numbers: number[] } {
  const numbers = input.split('\n').map(l => l.trim()).filter(Boolean).map(Number).filter(n => !isNaN(n));
  return { sum: numbers.reduce((a, b) => a + b, 0), count: numbers.length, numbers };
}
