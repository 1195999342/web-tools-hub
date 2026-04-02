export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function propertiesToYaml(props: string): ToolResult<string> {
  try {
    const obj: Record<string, unknown> = {};
    const lines = props.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;
      const eqIdx = trimmed.indexOf('=');
      const colonIdx = trimmed.indexOf(':');
      let sepIdx = -1;
      if (eqIdx >= 0 && colonIdx >= 0) sepIdx = Math.min(eqIdx, colonIdx);
      else if (eqIdx >= 0) sepIdx = eqIdx;
      else if (colonIdx >= 0) sepIdx = colonIdx;
      else continue;
      const key = trimmed.substring(0, sepIdx).trim();
      const value = trimmed.substring(sepIdx + 1).trim();
      const parts = key.split('.');
      let current: Record<string, unknown> = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
          current[parts[i]] = {};
        }
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = value;
    }
    return { output: objToYaml(obj, 0) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function objToYaml(obj: Record<string, unknown>, depth: number): string {
  const indent = '  '.repeat(depth);
  let result = '';
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result += `${indent}${key}:\n${objToYaml(value as Record<string, unknown>, depth + 1)}`;
    } else {
      result += `${indent}${key}: ${String(value)}\n`;
    }
  }
  return result;
}

export function yamlToProperties(yaml: string): ToolResult<string> {
  try {
    const lines = yaml.split('\n');
    const result: string[] = [];
    const stack: { indent: number; prefix: string }[] = [];
    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const indent = line.search(/\S/);
      const match = line.trim().match(/^([^:]+):\s*(.*)?$/);
      if (!match) continue;
      const key = match[1].trim();
      const value = (match[2] || '').trim();
      while (stack.length > 0 && stack[stack.length - 1].indent >= indent) stack.pop();
      const prefix = stack.length > 0 ? stack[stack.length - 1].prefix + '.' + key : key;
      if (value) {
        result.push(`${prefix}=${value}`);
      } else {
        stack.push({ indent, prefix });
      }
    }
    return { output: result.join('\n') };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
