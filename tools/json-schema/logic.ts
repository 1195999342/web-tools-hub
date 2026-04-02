export interface ToolResult<T> {
  output?: T;
  error?: string;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface SchemaNode {
  type?: string;
  properties?: Record<string, SchemaNode>;
  items?: SchemaNode;
  required?: string[];
}

export function generateSchema(json: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      ...inferSchema(obj, true),
    };
    return { output: JSON.stringify(schema, null, 2) };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

function inferSchema(value: JsonValue, isRoot: boolean = false): SchemaNode {
  if (value === null) return { type: 'null' };
  if (typeof value === 'string') return { type: 'string' };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
  }
  if (typeof value === 'boolean') return { type: 'boolean' };

  if (Array.isArray(value)) {
    const schema: SchemaNode = { type: 'array' };
    if (value.length > 0) {
      schema.items = inferSchema(value[0]);
    }
    return schema;
  }

  // Object
  const properties: Record<string, SchemaNode> = {};
  const keys = Object.keys(value as Record<string, JsonValue>);
  for (const key of keys) {
    properties[key] = inferSchema((value as Record<string, JsonValue>)[key]);
  }
  const schema: SchemaNode = { type: 'object', properties };
  if (isRoot && keys.length > 0) {
    schema.required = keys;
  }
  return schema;
}
