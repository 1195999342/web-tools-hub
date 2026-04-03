// SQL to JSON logic

export function sqlInsertToJson(sql: string): string {
  try {
    const results: Record<string, any>[] = [];
    // Match INSERT INTO table (cols) VALUES (vals), (vals)...
    const match = sql.match(/INSERT\s+INTO\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+)/i);
    if (!match) return '// Could not parse SQL. Provide INSERT INTO ... VALUES ... statement.';

    const columns = match[2].split(',').map(c => c.trim().replace(/[`"']/g, ''));
    const valuesStr = match[3];

    // Extract each VALUES group
    const valueGroups: string[] = [];
    let depth = 0, current = '';
    for (const ch of valuesStr) {
      if (ch === '(') { depth++; if (depth === 1) { current = ''; continue; } }
      if (ch === ')') { depth--; if (depth === 0) { valueGroups.push(current); continue; } }
      if (depth > 0) current += ch;
    }

    for (const group of valueGroups) {
      const values = parseValues(group);
      const obj: Record<string, any> = {};
      columns.forEach((col, i) => { obj[col] = values[i] ?? null; });
      results.push(obj);
    }

    return JSON.stringify(results, null, 2);
  } catch {
    return '// Error parsing SQL';
  }
}

function parseValues(str: string): any[] {
  const values: any[] = [];
  let current = '';
  let inString = false;
  let quote = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (!inString && (ch === "'" || ch === '"')) { inString = true; quote = ch; continue; }
    if (inString && ch === quote) { inString = false; values.push(current); current = ''; continue; }
    if (inString) { current += ch; continue; }
    if (ch === ',') {
      if (current.trim()) {
        const v = current.trim();
        if (v.toUpperCase() === 'NULL') values.push(null);
        else if (!isNaN(Number(v))) values.push(Number(v));
        else values.push(v);
      }
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) {
    const v = current.trim();
    if (v.toUpperCase() === 'NULL') values.push(null);
    else if (!isNaN(Number(v))) values.push(Number(v));
    else values.push(v);
  }
  return values;
}
