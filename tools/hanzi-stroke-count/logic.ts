// Approximate stroke count using Unicode CJK range heuristics
export function estimateStrokeCount(char: string): number {
  const code = char.codePointAt(0) ?? 0;
  if (code < 0x4e00 || code > 0x9fff) return 0;
  // Very rough heuristic based on code point ranges
  const offset = code - 0x4e00;
  return Math.min(Math.max(Math.floor(offset / 1500) + 1, 1), 30);
}

export function analyzeStrokes(text: string): { char: string; count: number }[] {
  return [...text].filter(c => (c.codePointAt(0) ?? 0) >= 0x4e00 && (c.codePointAt(0) ?? 0) <= 0x9fff)
    .map(c => ({ char: c, count: estimateStrokeCount(c) }));
}
