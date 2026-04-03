export function addQuotes(sql: string): string {
  return sql.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?=\s*(?:,|\s+(?:FROM|JOIN|WHERE|ON|SET|INTO|VALUES|AS|AND|OR|ORDER|GROUP|HAVING|LIMIT|OFFSET|SELECT|UPDATE|DELETE|INSERT|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|COLUMN))|\s*$)/gi, '"$1"');
}

export function removeQuotes(sql: string): string {
  return sql.replace(/"([^"]+)"/g, '$1');
}
