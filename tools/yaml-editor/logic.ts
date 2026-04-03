// Simple YAML parser/validator (handles common YAML subset)
export interface YamlResult {
  json: string;
  valid: boolean;
  error?: string;
}

export function yamlToJson(yaml: string): YamlResult {
  if (!yaml.trim()) return { json: '', valid: true };
  try {
    const obj = parseSimpleYaml(yaml);
    return { json: JSON.stringify(obj, null, 2), valid: true };
  } catch (e) {
    return { json: '', valid: false, error: (e as Error).message };
  }
}

function parseSimpleYaml(yaml: string): any {
  const lines = yaml.split('\n');
  const result: any = {};
  const stack: { indent: number; obj: any; key: string }[] = [{ indent: -1, obj: result, key: '' }];
  let currentArray: any[] | null = null;
  let currentArrayKey = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith('- ')) {
      const val = trimmed.slice(2).trim();
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parent = stack[stack.length - 1].obj;
      if (currentArrayKey && !Array.isArray(parent[currentArrayKey])) {
        parent[currentArrayKey] = [];
      }
      if (currentArrayKey && Array.isArray(parent[currentArrayKey])) {
        parent[currentArrayKey].push(parseValue(val));
      }
      continue;
    }

    // Key: value
    const match = trimmed.match(/^([^:]+):\s*(.*)/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();
      const parent = stack[stack.length - 1].obj;

      if (val === '' || val === '|' || val === '>') {
        parent[key] = {};
        stack.push({ indent, obj: parent[key], key });
        currentArrayKey = key;
      } else {
        parent[key] = parseValue(val);
        currentArrayKey = key;
      }
    }
  }
  return result;
}

function parseValue(val: string): any {
  if (val === 'true' || val === 'True') return true;
  if (val === 'false' || val === 'False') return false;
  if (val === 'null' || val === 'Null' || val === '~') return null;
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return val.slice(1, -1);
  if (val.startsWith('[') && val.endsWith(']')) {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
}

export function validateYaml(yaml: string): { valid: boolean; error?: string } {
  if (!yaml.trim()) return { valid: true };
  try {
    parseSimpleYaml(yaml);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
