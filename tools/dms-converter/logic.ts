export function decimalToDms(decimal: number): string {
  const d = Math.floor(Math.abs(decimal));
  const mf = (Math.abs(decimal) - d) * 60;
  const m = Math.floor(mf);
  const s = ((mf - m) * 60).toFixed(2);
  return `${decimal < 0 ? '-' : ''}${d}° ${m}' ${s}"`;
}

export function dmsToDecimal(dms: string): number {
  const match = dms.match(/(-?\d+)[°]\s*(\d+)['']\s*([\d.]+)[""]?/);
  if (!match) return NaN;
  const [, d, m, s] = match;
  const sign = d.startsWith('-') ? -1 : 1;
  return sign * (Math.abs(parseInt(d)) + parseInt(m) / 60 + parseFloat(s) / 3600);
}
