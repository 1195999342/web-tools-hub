export interface ToolResult<T> {
  output?: T;
  error?: string;
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES',
  'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP',
  'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'GROUP', 'BY',
  'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'ALL', 'AS',
  'DISTINCT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'NOT', 'NULL',
  'IN', 'BETWEEN', 'LIKE', 'IS', 'EXISTS', 'COUNT', 'SUM', 'AVG',
  'MAX', 'MIN', 'ASC', 'DESC', 'PRIMARY', 'KEY', 'FOREIGN', 'INDEX',
];

const NEWLINE_BEFORE = new Set(['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'UNION', 'SET', 'VALUES', 'ON']);

export function formatSql(sql: string): ToolResult<string> {
  try {
    const keywordSet = new Set(SQL_KEYWORDS);
    const tokens = sql.replace(/\s+/g, ' ').trim().split(/(\s+|,|\(|\))/g).filter(Boolean);
    let result = '';
    let indent = 0;
    const sp = '  ';
    for (const token of tokens) {
      const upper = token.trim().toUpperCase();
      if (!token.trim()) continue;
      if (upper === '(') { result += ' ('; indent++; continue; }
      if (upper === ')') { indent = Math.max(0, indent - 1); result += ')'; continue; }
      if (upper === ',') { result += ',\n' + sp.repeat(indent) + '  '; continue; }
      if (NEWLINE_BEFORE.has(upper)) {
        result += '\n' + sp.repeat(indent) + (keywordSet.has(upper) ? upper : token) + ' ';
      } else {
        result += (keywordSet.has(upper) ? upper : token) + ' ';
      }
    }
    return { output: result.trim() };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function minifySql(sql: string): ToolResult<string> {
  try {
    return { output: sql.replace(/\s+/g, ' ').trim() };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
