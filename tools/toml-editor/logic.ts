export interface TomlResult {
  json: string;
  valid: boolean;
  error?: string;
}

export function tomlToJson(toml: string): TomlResult {
  if (!toml.trim()) return { json: '', valid: true };
  try {
    const obj = parseSimpleToml(toml);
    return { json: JSON.stringify(obj, null, 2), valid: true };
  } catch (e) {
    return { json: '', valid: false, error: (e as Error).message };
  }
}

function parseSimpleToml(toml: string): any {
  const result: any = {};
  let current = result;
  const lines = toml.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Section header [section] or [[array]]
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      const path = sectionMatch[1].split('.');
      current = result;
      for (const p of path) {
        if (!current[p]) current[p] = {};
        current = current[p];
      }
      continue;
    }

    // Key = value
    const kvMatch = trimmed.match(/^([^=]+)=\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const val = kvMatch[2].trim();
      current[key] = parseTomlValue(val);
    }
  }
  return result;
}

function parseTomlValue(val: string): any {
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return val.slice(1, -1);
  if (val.startsWith('[') && val.endsWith(']')) {
    try {
      return JSON.parse(val.replace(/'/g, '"'));
    } catch {
      return val;
    }
  }
  return val;
}

export function validateToml(toml: string): { valid: boolean; error?: string } {
  if (!toml.trim()) return { valid: true };
  try {
    parseSimpleToml(toml);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
