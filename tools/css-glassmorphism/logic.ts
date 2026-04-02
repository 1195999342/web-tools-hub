export interface GlassConfig {
  blur: number;
  opacity: number;
  bgColor: string;
  borderRadius: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

export function generateCSS(config: GlassConfig): string {
  const { r, g, b } = hexToRgb(config.bgColor);
  return `background: rgba(${r}, ${g}, ${b}, ${(config.opacity / 100).toFixed(2)});
backdrop-filter: blur(${config.blur}px);
-webkit-backdrop-filter: blur(${config.blur}px);
border-radius: ${config.borderRadius}px;
border: 1px solid rgba(255, 255, 255, 0.18);`;
}
