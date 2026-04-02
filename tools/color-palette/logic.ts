function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); return Math.round(255 * c).toString(16).padStart(2, '0'); };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export type HarmonyRule = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'monochromatic';

export function generateHarmony(hex: string, rule: HarmonyRule): string[] {
  const [h, s, l] = hexToHsl(hex);
  switch (rule) {
    case 'complementary': return [hex, hslToHex((h + 180) % 360, s, l)];
    case 'analogous': return [hslToHex((h - 30 + 360) % 360, s, l), hex, hslToHex((h + 30) % 360, s, l)];
    case 'triadic': return [hex, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)];
    case 'split-complementary': return [hex, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l)];
    case 'tetradic': return [hex, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l)];
    case 'monochromatic': return [hslToHex(h, s, Math.max(l - 30, 10)), hslToHex(h, s, Math.max(l - 15, 10)), hex, hslToHex(h, s, Math.min(l + 15, 90)), hslToHex(h, s, Math.min(l + 30, 90))];
    default: return [hex];
  }
}

export const RULES: HarmonyRule[] = ['complementary', 'analogous', 'triadic', 'split-complementary', 'tetradic', 'monochromatic'];
