// PPI Calculator logic
export const TOOL_NAME = 'ppi-calc';

export function calcPPI(widthPx: number, heightPx: number, diagonalInches: number): number {
  const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
  return diagonalPx / diagonalInches;
}
