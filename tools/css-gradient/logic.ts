export interface GradientStop {
  color: string;
  position: number;
}

export function generateLinearGradient(angle: number, stops: GradientStop[]): string {
  const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  return `linear-gradient(${angle}deg, ${stopsStr})`;
}

export function generateRadialGradient(shape: 'circle' | 'ellipse', stops: GradientStop[]): string {
  const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  return `radial-gradient(${shape}, ${stopsStr})`;
}

export function generateCSS(type: 'linear' | 'radial', angle: number, shape: 'circle' | 'ellipse', stops: GradientStop[]): string {
  const gradient = type === 'linear' ? generateLinearGradient(angle, stops) : generateRadialGradient(shape, stops);
  return `background: ${gradient};`;
}
