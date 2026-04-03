// Inverse Color logic
export const TOOL_NAME = 'inverse-color';

export function invertColor(hex: string): string {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return '#000000';
  const r = 255 - parseInt(clean.slice(0, 2), 16);
  const g = 255 - parseInt(clean.slice(2, 4), 16);
  const b = 255 - parseInt(clean.slice(4, 6), 16);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function complementaryColor(hex: string): string {
  return invertColor(hex);
}
