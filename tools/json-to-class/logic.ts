export interface ToolResult<T> {
  output?: T;
  error?: string;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function inferType(value: JsonValue): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'float';
  if (typeof value === 'boolean') return 'boolean';
  if (Array.isArray(value)) return 'array';
  return 'object';
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// TypeScript
export function generateTypeScript(json: string, rootName: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const interfaces: string[] = [];
    genTsInterface(obj, rootName, interfaces);
    return { output: interfaces.join('\n\n') };
  } catch (e) { return { error: (e as Error).message }; }
}

function tsType(value: JsonValue, key: string, interfaces: string[]): string {
  const t = inferType(value);
  if (t === 'string') return 'string';
  if (t === 'integer' || t === 'float') return 'number';
  if (t === 'boolean') return 'boolean';
  if (t === 'null') return 'null';
  if (t === 'array') {
    const arr = value as JsonValue[];
    if (arr.length === 0) return 'unknown[]';
    return `${tsType(arr[0], key, interfaces)}[]`;
  }
  const name = capitalize(key);
  genTsInterface(value as Record<string, JsonValue>, name, interfaces);
  return name;
}

function genTsInterface(obj: Record<string, JsonValue>, name: string, interfaces: string[]) {
  const lines = Object.entries(obj).map(([k, v]) => `  ${k}: ${tsType(v, k, interfaces)};`);
  interfaces.push(`interface ${name} {\n${lines.join('\n')}\n}`);
}

// Java
export function generateJava(json: string, rootName: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const classes: string[] = [];
    genJavaClass(obj, rootName, classes);
    return { output: classes.join('\n\n') };
  } catch (e) { return { error: (e as Error).message }; }
}

function javaType(value: JsonValue, key: string, classes: string[]): string {
  const t = inferType(value);
  if (t === 'string') return 'String';
  if (t === 'integer') return 'int';
  if (t === 'float') return 'double';
  if (t === 'boolean') return 'boolean';
  if (t === 'null') return 'Object';
  if (t === 'array') {
    const arr = value as JsonValue[];
    if (arr.length === 0) return 'List<Object>';
    return `List<${javaBoxed(javaType(arr[0], key, classes))}>`;
  }
  const name = capitalize(key);
  genJavaClass(value as Record<string, JsonValue>, name, classes);
  return name;
}

function javaBoxed(t: string): string {
  const map: Record<string, string> = { int: 'Integer', double: 'Double', boolean: 'Boolean' };
  return map[t] ?? t;
}

function genJavaClass(obj: Record<string, JsonValue>, name: string, classes: string[]) {
  const fields = Object.entries(obj).map(([k, v]) => `    private ${javaType(v, k, classes)} ${k};`);
  classes.push(`public class ${name} {\n${fields.join('\n')}\n}`);
}

// Go
export function generateGo(json: string, rootName: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const structs: string[] = [];
    genGoStruct(obj, rootName, structs);
    return { output: structs.join('\n\n') };
  } catch (e) { return { error: (e as Error).message }; }
}

function goType(value: JsonValue, key: string, structs: string[]): string {
  const t = inferType(value);
  if (t === 'string') return 'string';
  if (t === 'integer') return 'int';
  if (t === 'float') return 'float64';
  if (t === 'boolean') return 'bool';
  if (t === 'null') return 'interface{}';
  if (t === 'array') {
    const arr = value as JsonValue[];
    if (arr.length === 0) return '[]interface{}';
    return `[]${goType(arr[0], key, structs)}`;
  }
  const name = capitalize(key);
  genGoStruct(value as Record<string, JsonValue>, name, structs);
  return name;
}

function genGoStruct(obj: Record<string, JsonValue>, name: string, structs: string[]) {
  const fields = Object.entries(obj).map(([k, v]) =>
    `\t${capitalize(k)} ${goType(v, k, structs)} \`json:"${k}"\``
  );
  structs.push(`type ${name} struct {\n${fields.join('\n')}\n}`);
}

// Python
export function generatePython(json: string, rootName: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const classes: string[] = [];
    classes.push('from dataclasses import dataclass');
    classes.push('from typing import List, Optional');
    genPyClass(obj, rootName, classes);
    return { output: classes.join('\n\n') };
  } catch (e) { return { error: (e as Error).message }; }
}

function pyType(value: JsonValue, key: string, classes: string[]): string {
  const t = inferType(value);
  if (t === 'string') return 'str';
  if (t === 'integer') return 'int';
  if (t === 'float') return 'float';
  if (t === 'boolean') return 'bool';
  if (t === 'null') return 'Optional[str]';
  if (t === 'array') {
    const arr = value as JsonValue[];
    if (arr.length === 0) return 'List';
    return `List[${pyType(arr[0], key, classes)}]`;
  }
  const name = capitalize(key);
  genPyClass(value as Record<string, JsonValue>, name, classes);
  return name;
}

function genPyClass(obj: Record<string, JsonValue>, name: string, classes: string[]) {
  const fields = Object.entries(obj).map(([k, v]) => `    ${k}: ${pyType(v, k, classes)}`);
  classes.push(`@dataclass\nclass ${name}:\n${fields.join('\n')}`);
}

// C#
export function generateCSharp(json: string, rootName: string): ToolResult<string> {
  try {
    const obj = JSON.parse(json);
    const classes: string[] = [];
    genCsClass(obj, rootName, classes);
    return { output: classes.join('\n\n') };
  } catch (e) { return { error: (e as Error).message }; }
}

function csType(value: JsonValue, key: string, classes: string[]): string {
  const t = inferType(value);
  if (t === 'string') return 'string';
  if (t === 'integer') return 'int';
  if (t === 'float') return 'double';
  if (t === 'boolean') return 'bool';
  if (t === 'null') return 'object';
  if (t === 'array') {
    const arr = value as JsonValue[];
    if (arr.length === 0) return 'List<object>';
    return `List<${csType(arr[0], key, classes)}>`;
  }
  const name = capitalize(key);
  genCsClass(value as Record<string, JsonValue>, name, classes);
  return name;
}

function genCsClass(obj: Record<string, JsonValue>, name: string, classes: string[]) {
  const props = Object.entries(obj).map(([k, v]) =>
    `    public ${csType(v, k, classes)} ${capitalize(k)} { get; set; }`
  );
  classes.push(`public class ${name}\n{\n${props.join('\n')}\n}`);
}
