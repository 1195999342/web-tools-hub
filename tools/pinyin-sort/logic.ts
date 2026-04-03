export interface GroupedResult {
  letter: string;
  items: string[];
}

export function sortByPinyin(input: string): GroupedResult[] {
  const lines = input.split('\n').map(s => s.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Use Intl.Collator for Chinese sorting
  const collator = new Intl.Collator('zh-Hans-CN', { sensitivity: 'accent' });
  const sorted = [...lines].sort((a, b) => collator.compare(a, b));

  // Group by first letter using localeCompare pinyin initial
  const groups: Map<string, string[]> = new Map();
  for (const item of sorted) {
    const initial = getPinyinInitial(item);
    if (!groups.has(initial)) groups.set(initial, []);
    groups.get(initial)!.push(item);
  }

  return Array.from(groups.entries()).map(([letter, items]) => ({ letter, items }));
}

function getPinyinInitial(str: string): string {
  if (!str) return '#';
  const first = str.charAt(0);
  // Try to get pinyin initial using localeCompare trick
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const letter of letters) {
    if (first.localeCompare(letter, 'zh-Hans-CN', { sensitivity: 'base' }) <= 0) {
      return letter;
    }
  }
  // If it's already a letter
  if (/[a-zA-Z]/.test(first)) return first.toUpperCase();
  return '#';
}
