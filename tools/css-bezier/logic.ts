export interface BezierPreset {
  name: string;
  values: [number, number, number, number];
}

export const PRESETS: BezierPreset[] = [
  { name: 'ease', values: [0.25, 0.1, 0.25, 1.0] },
  { name: 'ease-in', values: [0.42, 0, 1.0, 1.0] },
  { name: 'ease-out', values: [0, 0, 0.58, 1.0] },
  { name: 'ease-in-out', values: [0.42, 0, 0.58, 1.0] },
  { name: 'linear', values: [0, 0, 1, 1] },
  { name: 'ease-in-back', values: [0.6, -0.28, 0.735, 0.045] },
  { name: 'ease-out-back', values: [0.175, 0.885, 0.32, 1.275] },
  { name: 'ease-in-out-back', values: [0.68, -0.55, 0.265, 1.55] },
];

export function generateCSS(values: [number, number, number, number]): string {
  return `cubic-bezier(${values.map(v => v.toFixed(2)).join(', ')})`;
}

export function generateTransition(property: string, duration: number, values: [number, number, number, number]): string {
  return `transition: ${property} ${duration}ms ${generateCSS(values)};`;
}
