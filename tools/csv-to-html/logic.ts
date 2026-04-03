// CSV to HTML logic
export const TOOL_NAME = 'csv-to-html';

export function csvToRows(csv: string, delimiter: string): string[][] {
  return csv.trim().split('\n').map(line => line.split(delimiter).map(c => c.trim()));
}

export function rowsToHtml(rows: string[][], hasHeader: boolean): string {
  if (!rows.length) return '';
  let html = '<table>\n';
  rows.forEach((row, i) => {
    if (i === 0 && hasHeader) {
      html += '  <thead>\n    <tr>\n';
      row.forEach(c => { html += `      <th>${escapeHtml(c)}</th>\n`; });
      html += '    </tr>\n  </thead>\n  <tbody>\n';
    } else {
      if (i === 1 && hasHeader) { /* tbody already opened */ }
      html += '    <tr>\n';
      row.forEach(c => { html += `      <td>${escapeHtml(c)}</td>\n`; });
      html += '    </tr>\n';
    }
  });
  if (hasHeader) html += '  </tbody>\n';
  html += '</table>';
  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
