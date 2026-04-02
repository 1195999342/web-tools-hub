export type Radix = 2 | 8 | 10 | 16;

export interface ConversionResult {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
  error?: string;
}

export function convertRadix(input: string, fromRadix: Radix): ConversionResult {
  const empty: ConversionResult = { binary: '', octal: '', decimal: '', hex: '' };
  if (!input.trim()) return empty;
  try {
    const value = BigInt(fromRadix === 10 ? input : (fromRadix === 16 ? '0x' + input : (fromRadix === 8 ? '0o' + input : '0b' + input)));
    const isNeg = value < 0n;
    const abs = isNeg ? -value : value;
    const prefix = isNeg ? '-' : '';
    return {
      binary: prefix + abs.toString(2),
      octal: prefix + abs.toString(8),
      decimal: prefix + abs.toString(10),
      hex: prefix + abs.toString(16).toUpperCase(),
    };
  } catch {
    return { ...empty, error: 'invalid_input' };
  }
}
