// SQL to Form logic

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

function getInputType(sqlType: string): string {
  const t = sqlType.toUpperCase();
  if (t.includes('INT') || t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('DECIMAL')) return 'number';
  if (t.includes('DATE') && !t.includes('TIME')) return 'date';
  if (t.includes('DATETIME') || t.includes('TIMESTAMP')) return 'datetime-local';
  if (t.includes('TIME')) return 'time';
  if (t.includes('BOOL')) return 'checkbox';
  if (t.includes('TEXT')) return 'textarea';
  return 'text';
}

function toLabel(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function sqlToForm(sql: string): string {
  const parsed = parseCreateTable(sql);
  if (!parsed) return '<!-- Could not parse SQL -->';
  const { tableName, columns } = parsed;

  let html = `<form action="/${tableName}" method="POST">\n`;
  for (const col of columns) {
    if (col.name.toLowerCase() === 'id') continue;
    const inputType = getInputType(col.type);
    const required = !col.nullable ? ' required' : '';
    const label = toLabel(col.name);
    html += `  <div class="form-group">\n`;
    html += `    <label for="${col.name}">${label}</label>\n`;
    if (inputType === 'textarea') {
      html += `    <textarea id="${col.name}" name="${col.name}"${required}></textarea>\n`;
    } else if (inputType === 'checkbox') {
      html += `    <input type="checkbox" id="${col.name}" name="${col.name}" />\n`;
    } else {
      html += `    <input type="${inputType}" id="${col.name}" name="${col.name}"${required} />\n`;
    }
    html += `  </div>\n`;
  }
  html += `  <button type="submit">Submit</button>\n</form>`;
  return html;
}
