export function matrixToJson(input: string): { output?: string; error?: string } {
  try {
    const rows = input.trim().split('\n').map(r => r.trim().split(/[\s,]+/).map(Number));
    return { output: JSON.stringify(rows, null, 2) };
  } catch (e) { return { error: (e as Error).message }; }
}

export function jsonToMatrix(input: string): { output?: string; error?: string } {
  try {
    const arr = JSON.parse(input);
    if (!Array.isArray(arr)) return { error: 'Input must be a 2D array' };
    return { output: arr.map((row: number[]) => row.join('\t')).join('\n') };
  } catch (e) { return { error: (e as Error).message }; }
}
