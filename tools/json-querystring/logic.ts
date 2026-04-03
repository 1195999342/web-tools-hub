export function jsonToQueryString(input: string): { output?: string; error?: string } {
  try {
    const obj = JSON.parse(input);
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return { error: 'Input must be a flat JSON object' };
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) params.append(k, String(v));
    return { output: params.toString() };
  } catch (e) { return { error: (e as Error).message }; }
}

export function queryStringToJSON(input: string): { output?: string; error?: string } {
  try {
    const params = new URLSearchParams(input);
    const obj: Record<string, string> = {};
    params.forEach((v, k) => { obj[k] = v; });
    return { output: JSON.stringify(obj, null, 2) };
  } catch (e) { return { error: (e as Error).message }; }
}
