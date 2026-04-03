// Pi Lookup logic
export const TOOL_NAME = 'pi-lookup';

// Pre-computed 100 digits of pi after decimal
const PI_DIGITS = '3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196';

export function getPiDigits(n: number): string {
  if (n <= 0) return '3';
  // +2 for "3."
  return PI_DIGITS.slice(0, n + 2);
}

export function searchInPi(seq: string): number {
  const digits = PI_DIGITS.replace('.', '');
  const idx = digits.indexOf(seq, 1); // skip leading 3
  return idx === -1 ? -1 : idx - 1; // position after decimal
}
