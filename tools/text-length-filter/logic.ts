export function filterByLength(input: string, min: number, max: number): string {
  return input.split('\n').filter(line => line.length >= min && line.length <= max).join('\n');
}
