export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export type UnitCategory = 'length' | 'temperature' | 'weight' | 'volume' | 'area' | 'speed';

interface UnitDef {
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const UNITS: Record<UnitCategory, Record<string, UnitDef>> = {
  length: {
    m: { label: 'Meter', toBase: v => v, fromBase: v => v },
    km: { label: 'Kilometer', toBase: v => v * 1000, fromBase: v => v / 1000 },
    cm: { label: 'Centimeter', toBase: v => v / 100, fromBase: v => v * 100 },
    mm: { label: 'Millimeter', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mi: { label: 'Mile', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ft: { label: 'Foot', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    in: { label: 'Inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    yd: { label: 'Yard', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
  },
  temperature: {
    c: { label: '°C', toBase: v => v, fromBase: v => v },
    f: { label: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    k: { label: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  },
  weight: {
    kg: { label: 'Kilogram', toBase: v => v, fromBase: v => v },
    g: { label: 'Gram', toBase: v => v / 1000, fromBase: v => v * 1000 },
    mg: { label: 'Milligram', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    lb: { label: 'Pound', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    oz: { label: 'Ounce', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    t: { label: 'Metric Ton', toBase: v => v * 1000, fromBase: v => v / 1000 },
  },
  volume: {
    l: { label: 'Liter', toBase: v => v, fromBase: v => v },
    ml: { label: 'Milliliter', toBase: v => v / 1000, fromBase: v => v * 1000 },
    gal: { label: 'Gallon (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    qt: { label: 'Quart', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
    cup: { label: 'Cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    m3: { label: 'Cubic Meter', toBase: v => v * 1000, fromBase: v => v / 1000 },
  },
  area: {
    m2: { label: 'Square Meter', toBase: v => v, fromBase: v => v },
    km2: { label: 'Square Kilometer', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    ha: { label: 'Hectare', toBase: v => v * 10000, fromBase: v => v / 10000 },
    ft2: { label: 'Square Foot', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    ac: { label: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  },
  speed: {
    ms: { label: 'm/s', toBase: v => v, fromBase: v => v },
    kmh: { label: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    mph: { label: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    kn: { label: 'Knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
  },
};

export function getUnits(category: UnitCategory): { value: string; label: string }[] {
  return Object.entries(UNITS[category]).map(([k, v]) => ({ value: k, label: v.label }));
}

export function getCategories(): { value: UnitCategory; label: string }[] {
  return [
    { value: 'length', label: 'Length' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'weight', label: 'Weight' },
    { value: 'volume', label: 'Volume' },
    { value: 'area', label: 'Area' },
    { value: 'speed', label: 'Speed' },
  ];
}

export function convert(value: number, from: string, to: string, category: UnitCategory): ToolResult<number> {
  try {
    const units = UNITS[category];
    if (!units[from] || !units[to]) return { error: 'Unknown unit' };
    const base = units[from].toBase(value);
    const result = units[to].fromBase(base);
    return { output: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
