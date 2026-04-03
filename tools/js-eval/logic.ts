export function jsEvalEncode(code: string): string {
  const encoded = Array.from(new TextEncoder().encode(code)).map(b => String.fromCharCode(b + 1)).join('');
  return `eval(function(s){return s.split('').map(function(c){return String.fromCharCode(c.charCodeAt(0)-1)}).join('')}('${encoded.replace(/'/g, "\\'")}'))`;
}

export function jsEvalDecode(input: string): string {
  const match = input.match(/\('([^']*)'\)/);
  if (!match) return input;
  return match[1].replace(/\\'/g, "'").split('').map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join('');
}
