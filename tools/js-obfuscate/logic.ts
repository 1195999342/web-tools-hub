export function obfuscateJS(code: string): string {
  let counter = 0;
  const varMap = new Map<string, string>();
  return code.replace(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, keyword, name) => {
    if (!varMap.has(name)) varMap.set(name, `_0x${(counter++).toString(16).padStart(4, '0')}`);
    return `${keyword} ${varMap.get(name)}`;
  }).replace(/\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, name) => {
    if (!varMap.has(name)) varMap.set(name, `_0x${(counter++).toString(16).padStart(4, '0')}`);
    return `function ${varMap.get(name)}`;
  });
}
