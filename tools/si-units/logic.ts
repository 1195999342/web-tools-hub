export const SI_CATEGORIES: Record<string, Record<string, number>> = {
  force: { N: 1, kN: 1000, dyn: 0.00001, lbf: 4.44822 },
  energy: { J: 1, kJ: 1000, cal: 4.184, kcal: 4184, kWh: 3600000, eV: 1.602e-19 },
  frequency: { Hz: 1, kHz: 1000, MHz: 1e6, GHz: 1e9 },
  pressure: { Pa: 1, kPa: 1000, MPa: 1e6, bar: 100000, atm: 101325, psi: 6894.76 },
};

export function convertSI(value: number, from: string, to: string, category: string): number {
  const cat = SI_CATEGORIES[category];
  if (!cat || !cat[from] || !cat[to]) return NaN;
  return (value * cat[from]) / cat[to];
}
