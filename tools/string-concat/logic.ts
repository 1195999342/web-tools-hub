// String Concat logic
export const TOOL_NAME = 'string-concat';

export type Language = 'javascript' | 'python' | 'java' | 'csharp' | 'go' | 'php' | 'ruby';

export function generateConcat(lines: string[], lang: Language): string {
  if (!lines.length) return '';
  switch (lang) {
    case 'javascript':
      return lines.map((l, i) => i === 0 ? `const str = "${l}"` : `  + "${l}"`).join('\n') + ';';
    case 'python':
      return lines.map((l, i) => i === 0 ? `str = ("${l}"` : `      "${l}"`).join('\n') + ')';
    case 'java':
      return lines.map((l, i) => i === 0 ? `String str = "${l}"` : `  + "${l}"`).join('\n') + ';';
    case 'csharp':
      return lines.map((l, i) => i === 0 ? `string str = "${l}"` : `  + "${l}"`).join('\n') + ';';
    case 'go':
      return lines.map((l, i) => i === 0 ? `str := "${l}"` : `  + "${l}"`).join('\n');
    case 'php':
      return lines.map((l, i) => i === 0 ? `$str = "${l}"` : `  . "${l}"`).join('\n') + ';';
    case 'ruby':
      return lines.map((l, i) => i === 0 ? `str = "${l}"` : `  + "${l}"`).join('\n');
  }
}
