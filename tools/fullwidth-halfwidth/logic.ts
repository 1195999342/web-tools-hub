export function toFullwidth(input: string): string {
  return input.replace(/[\x21-\x7e]/g, c => String.fromCharCode(c.charCodeAt(0) + 0xfee0)).replace(/ /g, '\u3000');
}
export function toHalfwidth(input: string): string {
  return input.replace(/[\uff01-\uff5e]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/\u3000/g, ' ');
}
