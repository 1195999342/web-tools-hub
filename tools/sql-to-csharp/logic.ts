// SQL to C# logic

interface Column { name: string; type: string; nullable: boolean; }

function parseSQLType(sqlType: string): string {
  const t = sqlType.toUpperCase();
  if (t.includes('BIGINT')) return 'long';
  if (t.includes('INT')) return 'int';
  if (t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('DECIMAL') || t.includes('NUMERIC')) return 'decimal';
  if (t.includes('BOOL')) return 'bool';
  if (t.includes('DATE') || t.includes('TIME')) return 'DateTime';
  if (t.includes('TEXT') || t.includes('VARCHAR') || t.includes('CHAR')) return 'string';
  if (t.includes('BLOB') || t.includes('BINARY')) return 'byte[]';
  return 'string';
}

function parseCreateTable(sql: string): { tableName: string; columns: Column[] } | null {
  const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]+)\)/i);
  if (!match) return null;
  const columns: Column[] = [];
  for (const line of match[2].split(',')) {
    const trimmed = line.trim();
    if (/^(PRIMARY|KEY|INDEX|UNIQUE|CONSTRAINT|FOREIGN)/i.test(trimmed)) continue;
    const colMatch = trimmed.match(/[`"']?(\w+)[`"']?\s+(\w+(?:\([^)]*\))?)/);
    if (colMatch) columns.push({ name: colMatch[1], type: colMatch[2], nullable: !/NOT\s+NULL/i.test(trimmed) });
  }
  return { tableName: match[1], columns };
}

function toPascalCase(s: string): string {
  return s.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

export function sqlToCSharp(sql: string): string {
  const parsed = parseCreateTable(sql);
  if (!parsed) return '// Could not parse SQL. Please provide a CREATE TABLE statement.';
  const { tableName, columns } = parsed;
  const className = toPascalCase(tableName);

  let code = `public class ${className}\n{\n`;
  for (const col of columns) {
    const csType = parseSQLType(col.type);
    const nullable = col.nullable && !['string', 'byte[]'].includes(csType) ? '?' : '';
    code += `    public ${csType}${nullable} ${toPascalCase(col.name)} { get; set; }\n`;
  }
  code += '}';
  return code;
}
