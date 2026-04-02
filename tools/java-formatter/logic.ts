export function formatJava(code: string, indentSize: number = 4): string {
  const indentStr = ' '.repeat(indentSize);
  let indent = 0;
  const result: string[] = [];
  const tokens = code.replace(/\{/g, '{\n').replace(/\}/g, '\n}\n').replace(/;/g, ';\n').split('\n');
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (trimmed === '}' || trimmed.startsWith('}')) indent = Math.max(0, indent - 1);
    result.push(indentStr.repeat(indent) + trimmed);
    if (trimmed.endsWith('{')) indent++;
  }
  return result.join('\n');
}
