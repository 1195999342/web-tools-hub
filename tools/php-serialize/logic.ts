export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function phpSerialize(json: string): ToolResult<string> {
  try {
    const data = JSON.parse(json);
    return { output: serialize(data) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function serialize(value: unknown): string {
  if (value === null) return 'N;';
  if (typeof value === 'boolean') return `b:${value ? 1 : 0};`;
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return `i:${value};`;
    return `d:${value};`;
  }
  if (typeof value === 'string') return `s:${value.length}:"${value}";`;
  if (Array.isArray(value)) {
    const items = value.map((v, i) => `${serialize(i)}${serialize(v)}`).join('');
    return `a:${value.length}:{${items}}`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    const items = entries.map(([k, v]) => `${serialize(k)}${serialize(v)}`).join('');
    return `a:${entries.length}:{${items}}`;
  }
  return 'N;';
}

export function phpUnserialize(input: string): ToolResult<string> {
  try {
    let pos = 0;
    function read(): unknown {
      const type = input[pos];
      if (type === 'N') { pos += 2; return null; }
      if (type === 'b') { pos += 2; const v = input[pos] === '1'; pos += 2; return v; }
      if (type === 'i') {
        pos += 2;
        const end = input.indexOf(';', pos);
        const v = parseInt(input.substring(pos, end));
        pos = end + 1;
        return v;
      }
      if (type === 'd') {
        pos += 2;
        const end = input.indexOf(';', pos);
        const v = parseFloat(input.substring(pos, end));
        pos = end + 1;
        return v;
      }
      if (type === 's') {
        pos += 2;
        const lenEnd = input.indexOf(':', pos);
        const len = parseInt(input.substring(pos, lenEnd));
        pos = lenEnd + 2; // skip :"
        const str = input.substring(pos, pos + len);
        pos += len + 2; // skip ";
        return str;
      }
      if (type === 'a') {
        pos += 2;
        const lenEnd = input.indexOf(':', pos);
        const count = parseInt(input.substring(pos, lenEnd));
        pos = lenEnd + 2; // skip :{
        const isArray = true;
        const obj: Record<string, unknown> = {};
        let allNumeric = true;
        for (let i = 0; i < count; i++) {
          const key = read();
          const val = read();
          if (typeof key === 'number') obj[key] = val;
          else { allNumeric = false; obj[String(key)] = val; }
        }
        pos++; // skip }
        if (allNumeric) {
          const arr: unknown[] = [];
          for (let i = 0; i < count; i++) arr.push(obj[i]);
          return arr;
        }
        return obj;
      }
      throw new Error(`Unknown type at position ${pos}: ${type}`);
    }
    const result = read();
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
