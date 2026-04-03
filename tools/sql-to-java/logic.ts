// SQL to Java logic

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

function parseSQLType(sqlType: string): string {
  const t = sqlType.toUpperCase();
  if (t.includes('INT')) return 'Integer';
  if (t.includes('BIGINT')) return 'Long';
  if (t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('DECIMAL') || t.includes('NUMERIC')) return 'Double';
  if (t.includes('BOOL')) return 'Boolean';
  if (t.includes('DATE') || t.includes('TIME')) return 'java.util.Date';
  if (t.includes('TEXT') || t.includes('VARCHAR') || t.includes('CHAR')) return 'String';
  if (t.includes('BLOB') || t.includes('BINARY')) return 'byte[]';
  return 'String';
}

function parseCreateTable(sql: string): { tableName: string; columns: Column[] } | null {
  const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]+)\)/i);
  if (!match) return null;
  const tableName = match[1];
  const body = match[2];
  const columns: Column[] = [];
  for (const line of body.split(',')) {
    const trimmed = line.trim();
    if (/^(PRIMARY|KEY|INDEX|UNIQUE|CONSTRAINT|FOREIGN)/i.test(trimmed)) continue;
    const colMatch = trimmed.match(/[`"']?(\w+)[`"']?\s+(\w+(?:\([^)]*\))?)/);
    if (colMatch) {
      columns.push({
        name: colMatch[1],
        type: colMatch[2],
        nullable: !/NOT\s+NULL/i.test(trimmed),
      });
    }
  }
  return { tableName, columns };
}

function toPascalCase(s: string): string {
  return s.replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
}

function toCamelCase(s: string): string {
  const p = toPascalCase(s);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

export function sqlToJava(sql: string): string {
  const parsed = parseCreateTable(sql);
  if (!parsed) return '// Could not parse SQL. Please provide a CREATE TABLE statement.';
  const { tableName, columns } = parsed;
  const className = toPascalCase(tableName);

  let code = `public class ${className} {\n\n`;
  for (const col of columns) {
    const jType = parseSQLType(col.type);
    code += `    private ${jType} ${toCamelCase(col.name)};\n`;
  }
  code += '\n';
  // Constructor
  code += `    public ${className}() {}\n\n`;
  // Getters and setters
  for (const col of columns) {
    const jType = parseSQLType(col.type);
    const field = toCamelCase(col.name);
    const pascal = toPascalCase(col.name);
    code += `    public ${jType} get${pascal}() { return ${field}; }\n`;
    code += `    public void set${pascal}(${jType} ${field}) { this.${field} = ${field}; }\n\n`;
  }
  code += '}';
  return code;
}
