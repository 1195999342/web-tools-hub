export interface ToolResult<T> {
  output?: T;
  error?: string;
}

// JSON → YAML (simple key:value)
export function jsonToYaml(json: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    return { output: toYaml(obj, 0) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function toYaml(value: unknown, indent: number): string {
  const prefix = '  '.repeat(indent);
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes(':') || value.includes('#') || value.includes('"') || value.includes("'") || value.trim() !== value) {
      return JSON.stringify(value);
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value.map((item) => {
      const v = toYaml(item, indent + 1);
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const lines = v.split('\n');
        return `${prefix}- ${lines[0]}\n${lines.slice(1).map((l) => `${prefix}  ${l}`).join('\n')}`;
      }
      return `${prefix}- ${v}`;
    }).join('\n');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        return `${prefix}${k}:\n${toYaml(v, indent + 1)}`;
      }
      return `${prefix}${k}: ${toYaml(v, indent + 1)}`;
    }).join('\n');
  }
  return String(value);
}

// YAML → JSON (simple parser)
export function yamlToJson(yaml: string): ToolResult<string> {
  try {
    const result = parseYaml(yaml);
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function parseYaml(yaml: string): unknown {
  const lines = yaml.split('\n');
  if (lines.length === 0) return {};
  // Check if it starts with array items
  const firstNonEmpty = lines.find((l) => l.trim().length > 0);
  if (!firstNonEmpty) return {};
  if (firstNonEmpty.trim().startsWith('- ')) {
    return parseYamlArray(lines, 0).value;
  }
  return parseYamlObject(lines, 0).value;
}

function getIndent(line: string): number {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

function parseYamlValue(val: string): unknown {
  const trimmed = val.trim();
  if (trimmed === 'null' || trimmed === '~') return null;
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === '[]') return [];
  if (trimmed === '{}') return {};
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseYamlObject(lines: string[], baseIndent: number): { value: Record<string, unknown>; consumed: number } {
  const obj: Record<string, unknown> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) { i++; continue; }
    const indent = getIndent(line);
    if (indent < baseIndent) break;
    if (indent > baseIndent) break;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) { i++; continue; }
    const key = line.slice(indent, colonIdx).trim();
    const rest = line.slice(colonIdx + 1).trim();
    if (rest === '' || rest.startsWith('#')) {
      // Check next lines for nested content
      const nextI = i + 1;
      if (nextI < lines.length) {
        const nextLine = lines.slice(nextI).find((l) => l.trim().length > 0);
        if (nextLine) {
          const nextIndent = getIndent(nextLine);
          if (nextIndent > indent) {
            if (nextLine.trim().startsWith('- ')) {
              const result = parseYamlArray(lines.slice(nextI), nextIndent);
              obj[key] = result.value;
              i = nextI + result.consumed;
            } else {
              const result = parseYamlObject(lines.slice(nextI), nextIndent);
              obj[key] = result.value;
              i = nextI + result.consumed;
            }
            continue;
          }
        }
      }
      obj[key] = null;
    } else {
      obj[key] = parseYamlValue(rest);
    }
    i++;
  }
  return { value: obj, consumed: i };
}

function parseYamlArray(lines: string[], baseIndent: number): { value: unknown[]; consumed: number } {
  const arr: unknown[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '' || line.trim().startsWith('#')) { i++; continue; }
    const indent = getIndent(line);
    if (indent < baseIndent) break;
    const trimmed = line.trim();
    if (!trimmed.startsWith('- ')) break;
    const val = trimmed.slice(2).trim();
    if (val.includes(':') && !val.startsWith('"') && !val.startsWith("'")) {
      // Inline object in array item
      const colonIdx = val.indexOf(':');
      const k = val.slice(0, colonIdx).trim();
      const v = val.slice(colonIdx + 1).trim();
      const obj: Record<string, unknown> = {};
      obj[k] = v === '' ? null : parseYamlValue(v);
      // Check for continuation lines at deeper indent
      const nextI = i + 1;
      if (nextI < lines.length) {
        const nextLine = lines[nextI];
        if (nextLine && nextLine.trim().length > 0 && getIndent(nextLine) > indent) {
          const result = parseYamlObject(lines.slice(nextI), getIndent(nextLine));
          Object.assign(obj, result.value);
          i = nextI + result.consumed;
          arr.push(obj);
          continue;
        }
      }
      arr.push(obj);
    } else {
      arr.push(parseYamlValue(val));
    }
    i++;
  }
  return { value: arr, consumed: i };
}

// JSON → XML
export function jsonToXml(json: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const xml = toXml(obj, 'root', 0);
    return { output: `<?xml version="1.0" encoding="UTF-8"?>\n${xml}` };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function toXml(value: unknown, tag: string, indent: number): string {
  const prefix = '  '.repeat(indent);
  if (value === null || value === undefined) return `${prefix}<${tag} />`;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return `${prefix}<${tag}>${escapeXml(String(value))}</${tag}>`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => toXml(item, 'item', indent)).join('\n');
  }
  const entries = Object.entries(value as Record<string, unknown>);
  const children = entries.map(([k, v]) => {
    if (Array.isArray(v)) {
      return v.map((item) => toXml(item, k, indent + 1)).join('\n');
    }
    return toXml(v, k, indent + 1);
  }).join('\n');
  return `${prefix}<${tag}>\n${children}\n${prefix}</${tag}>`;
}

// XML → JSON
export function xmlToJson(xml: string): ToolResult<string> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) return { error: 'Invalid XML' };
    const result = xmlNodeToObj(doc.documentElement);
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function xmlNodeToObj(node: Element): unknown {
  const children = Array.from(node.children);
  if (children.length === 0) {
    return node.textContent || '';
  }
  const obj: Record<string, unknown> = {};
  for (const child of children) {
    const key = child.tagName;
    const val = xmlNodeToObj(child);
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) {
        (obj[key] as unknown[]).push(val);
      } else {
        obj[key] = [obj[key], val];
      }
    } else {
      obj[key] = val;
    }
  }
  return obj;
}

// JSON → TOML (basic)
export function jsonToToml(json: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return { error: 'TOML requires a top-level object' };
    }
    return { output: toToml(obj as Record<string, unknown>, '') };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function tomlValue(v: unknown): string {
  if (v === null) return '""';
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return `[${v.map(tomlValue).join(', ')}]`;
  return JSON.stringify(v);
}

function toToml(obj: Record<string, unknown>, prefix: string): string {
  const lines: string[] = [];
  const tables: [string, Record<string, unknown>][] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      tables.push([k, v as Record<string, unknown>]);
    } else {
      lines.push(`${k} = ${tomlValue(v)}`);
    }
  }
  for (const [k, v] of tables) {
    const section = prefix ? `${prefix}.${k}` : k;
    lines.push('');
    lines.push(`[${section}]`);
    lines.push(toToml(v, section));
  }
  return lines.join('\n');
}

// TOML → JSON (basic)
export function tomlToJson(toml: string): ToolResult<string> {
  try {
    const result = parseToml(toml);
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function parseToml(toml: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let current = root;
  const lines = toml.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      const path = sectionMatch[1].split('.');
      current = root;
      for (const p of path) {
        if (!(p in current) || typeof current[p] !== 'object') {
          current[p] = {};
        }
        current = current[p] as Record<string, unknown>;
      }
      continue;
    }
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    const val = line.slice(eqIdx + 1).trim();
    current[key] = parseTomlValue(val);
  }
  return root;
}

function parseTomlValue(val: string): unknown {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  if (val.startsWith('[') && val.endsWith(']')) {
    const inner = val.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((s) => parseTomlValue(s.trim()));
  }
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  return val;
}

// JSON → CSV
export function jsonToCsv(json: string): ToolResult<string> {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr) || arr.length === 0) {
      return { error: 'Input must be a non-empty JSON array of objects' };
    }
    const keys = Object.keys(arr[0]);
    const header = keys.map(csvEscape).join(',');
    const rows = arr.map((item: Record<string, unknown>) =>
      keys.map((k) => csvEscape(String(item[k] ?? ''))).join(',')
    );
    return { output: [header, ...rows].join('\n') };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function csvEscape(s: string): string {
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// CSV → JSON
export function csvToJson(csv: string): ToolResult<string> {
  try {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return { error: 'CSV must have at least a header and one data row' };
    const headers = parseCsvLine(lines[0]);
    const result = lines.slice(1).filter((l) => l.trim()).map((line) => {
      const values = parseCsvLine(line);
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
      return obj;
    });
    return { output: JSON.stringify(result, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}
