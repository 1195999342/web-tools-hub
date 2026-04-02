export interface ToolResult<T> {
  output?: T;
  error?: string;
}

function escapeValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

export function jsonToSql(json: string, tableName: string): ToolResult<string> {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return { error: 'Input must be a JSON array' };
    if (data.length === 0) return { output: '-- Empty array, no INSERT statements generated' };
    const statements: string[] = [];
    for (const row of data) {
      if (typeof row !== 'object' || row === null || Array.isArray(row)) continue;
      const keys = Object.keys(row);
      const cols = keys.map((k) => `\`${k}\``).join(', ');
      const vals = keys.map((k) => escapeValue(row[k])).join(', ');
      statements.push(`INSERT INTO \`${tableName}\` (${cols}) VALUES (${vals});`);
    }
    return { output: statements.join('\n') };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
