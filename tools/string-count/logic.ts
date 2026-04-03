export function countOccurrences(text: string, search: string, caseSensitive: boolean): number {
  if (!search) return 0;
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
  return (text.match(regex) || []).length;
}
