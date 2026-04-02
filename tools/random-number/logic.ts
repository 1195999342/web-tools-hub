export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export function generateRandomIntegers(min: number, max: number, count: number): ToolResult<number[]> {
  try {
    if (min > max) return { error: 'Min must be less than or equal to max' };
    if (count < 1 || count > 1000) return { error: 'Count must be between 1 and 1000' };
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      const range = max - min + 1;
      const rand = crypto.getRandomValues(new Uint32Array(1))[0];
      results.push(min + (rand % range));
    }
    return { output: results };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export function generateRandomFloats(min: number, max: number, count: number, decimals: number = 4): ToolResult<number[]> {
  try {
    if (min > max) return { error: 'Min must be less than or equal to max' };
    if (count < 1 || count > 1000) return { error: 'Count must be between 1 and 1000' };
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      const rand = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
      const value = min + rand * (max - min);
      results.push(parseFloat(value.toFixed(decimals)));
    }
    return { output: results };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
