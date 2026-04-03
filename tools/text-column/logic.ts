export function extractColumn(input: string, column: number, delimiter: string = '\t'): string {
  return input.split('\n').map(line => {
    const parts = line.split(delimiter);
    return parts[column - 1] ?? '';
  }).join('\n');
}
