export function generateSequence(start: number, end: number, step: number, prefix: string = '', suffix: string = ''): string {
  const lines: string[] = [];
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) lines.push(`${prefix}${i}${suffix}`);
  return lines.join('\n');
}
