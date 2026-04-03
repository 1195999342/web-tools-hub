export function generateRainbowHtml(text: string): string {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  return [...text].map((c, i) => {
    if (c === ' ') return ' ';
    const color = colors[i % colors.length];
    return `<span style="color:${color}">${c}</span>`;
  }).join('');
}

export function generateGradientHtml(text: string, startColor: string, endColor: string): string {
  const len = text.length;
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  if (!start || !end) return text;
  return [...text].map((c, i) => {
    if (c === ' ') return ' ';
    const r = Math.round(start.r + (end.r - start.r) * i / Math.max(len - 1, 1));
    const g = Math.round(start.g + (end.g - start.g) * i / Math.max(len - 1, 1));
    const b = Math.round(start.b + (end.b - start.b) * i / Math.max(len - 1, 1));
    return `<span style="color:rgb(${r},${g},${b})">${c}</span>`;
  }).join('');
}

function hexToRgb(hex: string) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}
