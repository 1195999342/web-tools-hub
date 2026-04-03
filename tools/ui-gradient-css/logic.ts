// UI Gradient CSS logic

export function generateGradientCSS(color1: string, color2: string, angle: number): string {
  return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
}

export function generateSteppedGradient(color1: string, color2: string, steps: number): string[] {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return [];
  return Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
  });
}

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}
