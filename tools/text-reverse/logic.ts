export function reverseText(input: string): string {
  return [...input].reverse().join('');
}
export function reverseLines(input: string): string {
  return input.split('\n').reverse().join('\n');
}
