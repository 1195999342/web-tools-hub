export function jsEscape(input: string): string {
  return input.replace(/[\\"']/g, '\\$&').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

export function jsUnescape(input: string): string {
  return input.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\(['"\\/])/g, '$1');
}
