export interface NeuConfig {
  distance: number;
  blur: number;
  intensity: number;
  bgColor: string;
  shape: 'flat' | 'concave' | 'convex' | 'pressed';
}

function adjustColor(hex: string, amount: number): string {
  const h = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(h.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(h.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(h.substring(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function generateCSS(config: NeuConfig): string {
  const light = adjustColor(config.bgColor, config.intensity);
  const dark = adjustColor(config.bgColor, -config.intensity);
  const d = config.distance;
  const b = config.blur;
  let shadow: string;
  let bg = `background: ${config.bgColor};`;
  if (config.shape === 'pressed') {
    shadow = `box-shadow: inset ${d}px ${d}px ${b}px ${dark}, inset -${d}px -${d}px ${b}px ${light};`;
  } else {
    shadow = `box-shadow: ${d}px ${d}px ${b}px ${dark}, -${d}px -${d}px ${b}px ${light};`;
  }
  if (config.shape === 'concave') {
    bg = `background: linear-gradient(145deg, ${dark}, ${light});`;
  } else if (config.shape === 'convex') {
    bg = `background: linear-gradient(145deg, ${light}, ${dark});`;
  }
  return `border-radius: 15px;\n${bg}\n${shadow}`;
}
