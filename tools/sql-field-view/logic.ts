// SQL Field View logic

export interface FieldInfo {
  name: string;
  value: string;
}

export function extractFields(sql: string): FieldInfo[] {
  const fields: FieldInfo[] = [];
  const trimmed = sql.trim();

  // Try INSERT
  const insertMatch = trimmed.match(/INSERT\s+INTO\s+\S+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
  if (insertMatch) {
    const cols = insertMatch[1].split(',').map(c => c.trim().replace(/[`"']/g, ''));
    const vals = splitValues(insertMatch[2]);
    cols.forEach((col, i) => fields.push({ name: col, value: vals[i] || '' }));
    return fields;
  }

  // Try UPDATE
  const updateMatch = trimmed.match(/UPDATE\s+\S+\s+SET\s+([\s\S]+?)(?:\s+WHERE|$)/i);
  if (updateMatch) {
    const pairs = updateMatch[1].split(',');
    for (const pair of pairs) {
      const eqIdx = pair.indexOf('=');
      if (eqIdx > 0) {
        fields.push({
          name: pair.slice(0, eqIdx).trim().replace(/[`"']/g, ''),
          value: pair.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, ''),
        });
      }
    }
    return fields;
  }

  return fields;
}

function splitValues(str: string): string[] {
  const values: string[] = [];
  let current = '';
  let inStr = false;
  let quote = '';
  for (const ch of str) {
    if (!inStr && (ch === "'" || ch === '"')) { inStr = true; quote = ch; continue; }
    if (inStr && ch === quote) { inStr = false; values.push(current); current = ''; continue; }
    if (inStr) { current += ch; continue; }
    if (ch === ',') { if (current.trim()) values.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) values.push(current.trim());
  return values;
}
