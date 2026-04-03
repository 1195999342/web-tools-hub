export function formatRubyCode(code: string): string {
  let indent = 0;
  const openers = /^(def|class|module|if|unless|while|until|for|do|begin|case)\b/;
  const closers = /^(end|rescue|else|elsif|when)\b/;
  return code.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (closers.test(trimmed)) indent = Math.max(0, indent - 1);
    const result = '  '.repeat(indent) + trimmed;
    if (openers.test(trimmed)) indent++;
    return result;
  }).join('\n');
}
