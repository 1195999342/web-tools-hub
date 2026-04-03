// SQL to Yii2 ActiveRecord logic

interface Column { name: string; type: string; nullable: boolean; }

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

function phpType(sqlType: string): string {
  const t = sqlType.toUpperCase();
  if (t.includes('INT')) return 'integer';
  if (t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('DECIMAL')) return 'number';
  if (t.includes('BOOL')) return 'boolean';
  return 'string';
}

export function sqlToYii(sql: string): string {
  const parsed = parseCreateTable(sql);
  if (!parsed) return '// Could not parse SQL. Provide a CREATE TABLE statement.';
  const { tableName, columns } = parsed;
  const className = toPascalCase(tableName);

  let code = `<?php\n\nnamespace app\\models;\n\nuse yii\\db\\ActiveRecord;\n\n`;
  code += `/**\n * @table ${tableName}\n`;
  for (const col of columns) {
    code += ` * @property ${phpType(col.type)} $${col.name}\n`;
  }
  code += ` */\n`;
  code += `class ${className} extends ActiveRecord\n{\n`;
  code += `    public static function tableName()\n    {\n        return '{{%${tableName}}}';\n    }\n\n`;
  code += `    public function rules()\n    {\n        return [\n`;

  const required = columns.filter(c => !c.nullable && c.name !== 'id').map(c => `'${c.name}'`);
  if (required.length) code += `            [[${required.join(', ')}], 'required'],\n`;

  const integers = columns.filter(c => phpType(c.type) === 'integer' && c.name !== 'id').map(c => `'${c.name}'`);
  if (integers.length) code += `            [[${integers.join(', ')}], 'integer'],\n`;

  const strings = columns.filter(c => phpType(c.type) === 'string').map(c => `'${c.name}'`);
  if (strings.length) code += `            [[${strings.join(', ')}], 'string'],\n`;

  code += `        ];\n    }\n\n`;
  code += `    public function attributeLabels()\n    {\n        return [\n`;
  for (const col of columns) {
    const label = col.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    code += `            '${col.name}' => '${label}',\n`;
  }
  code += `        ];\n    }\n}\n`;
  return code;
}
