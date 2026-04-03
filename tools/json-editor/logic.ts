export function formatJSON(input: string): { output?: string; error?: string } {
  try {
    return { output: JSON.stringify(JSON.parse(input), null, 2) };
  } catch (e) { return { error: (e as Error).message }; }
}

export function minifyJSON(input: string): { output?: string; error?: string } {
  try {
    return { output: JSON.stringify(JSON.parse(input)) };
  } catch (e) { return { error: (e as Error).message }; }
}

export function validateJSON(input: string): { valid: boolean; error?: string } {
  try { JSON.parse(input); return { valid: true }; }
  catch (e) { return { valid: false, error: (e as Error).message }; }
}
