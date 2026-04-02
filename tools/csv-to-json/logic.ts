export function csvToJson(csv: string, delimiter: string = ','): string {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return '[]';
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  const result = lines.slice(1).filter(l => l.trim()).map(line => {
    const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}
