const CN_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const CN_UNITS = ['', '拾', '佰', '仟'];
const CN_SECTIONS = ['', '万', '亿', '兆'];

export function numberToCurrencyCN(num: number): string {
  if (num === 0) return '零元整';
  const isNeg = num < 0;
  num = Math.abs(num);
  const [intPart, decPart] = num.toFixed(2).split('.');
  let result = '';
  const digits = intPart.split('').reverse();
  for (let i = 0; i < digits.length; i++) {
    const d = parseInt(digits[i]);
    const unitIdx = i % 4;
    const secIdx = Math.floor(i / 4);
    if (d !== 0) result = CN_DIGITS[d] + CN_UNITS[unitIdx] + (unitIdx === 0 ? CN_SECTIONS[secIdx] : '') + result;
    else if (result && !result.startsWith('零')) result = '零' + result;
  }
  result += '元';
  const jiao = parseInt(decPart[0]);
  const fen = parseInt(decPart[1]);
  if (jiao === 0 && fen === 0) result += '整';
  else { if (jiao > 0) result += CN_DIGITS[jiao] + '角'; if (fen > 0) result += CN_DIGITS[fen] + '分'; }
  return (isNeg ? '负' : '') + result;
}

export function numberToUppercaseEN(num: number): string {
  if (num === 0) return 'ZERO DOLLARS';
  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  const intPart = Math.floor(Math.abs(num));
  if (intPart < 20) return ones[intPart] + ' DOLLARS';
  if (intPart < 100) return tens[Math.floor(intPart / 10)] + (intPart % 10 ? ' ' + ones[intPart % 10] : '') + ' DOLLARS';
  return String(intPart) + ' DOLLARS';
}
