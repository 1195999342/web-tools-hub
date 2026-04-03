export function addLineNumbers(text: string, start: number = 1, separator: string = '. '): string {
  return text.split('\n').map((line, i) => `${i + start}${separator}${line}`).join('\n');
}
export function removeLineNumbers(text: string): string {
  return text.split('\n').map(line => line.replace(/^\d+[\.\)\-:\s]+/, '')).join('\n');
}
