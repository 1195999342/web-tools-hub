// Prime Generator logic
export const TOOL_NAME = 'prime-gen';

export function generatePrimes(start: number, end: number): number[] {
  if (start > end || end < 2) return [];
  const lo = Math.max(2, start);
  const sieve = new Array(end + 1).fill(true);
  sieve[0] = sieve[1] = false;
  for (let i = 2; i * i <= end; i++) {
    if (sieve[i]) for (let j = i * i; j <= end; j += i) sieve[j] = false;
  }
  const primes: number[] = [];
  for (let i = lo; i <= end; i++) if (sieve[i]) primes.push(i);
  return primes;
}
