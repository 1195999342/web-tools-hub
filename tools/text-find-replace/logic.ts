export function findReplace(text: string, find: string, replace: string, useRegex: boolean, caseSensitive: boolean): { output: string; count: number } {
  if (!find) return { output: text, count: 0 };
  try {
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    let count = 0;
    const output = text.replace(regex, (match) => { count++; return replace; });
    return { output, count };
  } catch { return { output: text, count: 0 }; }
}
