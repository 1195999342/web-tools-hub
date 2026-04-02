export type CSSUnit = 'px' | 'em' | 'rem' | 'pt' | '%';

export function convert(value: number, from: CSSUnit, to: CSSUnit, baseFontSize: number = 16): number {
  // Convert to px first
  let px: number;
  switch (from) {
    case 'px': px = value; break;
    case 'em': case 'rem': px = value * baseFontSize; break;
    case 'pt': px = value * (96 / 72); break;
    case '%': px = (value / 100) * baseFontSize; break;
    default: px = value;
  }
  // Convert from px to target
  switch (to) {
    case 'px': return Math.round(px * 1000) / 1000;
    case 'em': case 'rem': return Math.round((px / baseFontSize) * 1000) / 1000;
    case 'pt': return Math.round((px * 72 / 96) * 1000) / 1000;
    case '%': return Math.round((px / baseFontSize * 100) * 1000) / 1000;
    default: return px;
  }
}

export const UNITS: CSSUnit[] = ['px', 'em', 'rem', 'pt', '%'];
