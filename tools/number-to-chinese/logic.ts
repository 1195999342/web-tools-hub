const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const UNITS = ['', '十', '百', '千'];
const BIG_UNITS = ['', '万', '亿', '兆'];
const UPPER_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const UPPER_UNITS = ['', '拾', '佰', '仟'];
const UPPER_BIG = ['', '万', '亿', '兆'];

function convertSection(num: string, digits: string[], units: string[]): string {
  let result = '';
  let zeroFlag = false;
  for (let i = 0; i < num.length; i++) {
    const d = parseInt(num[i]);
    const pos = num.length - 1 - i;
    if (d === 0) { zeroFlag = true; continue; }
    if (zeroFlag) { result += digits[0]; zeroFlag = false; }
    result += digits[d] + units[pos % 4];
  }
  return result;
}

export function numberToChinese(num: number): string {
  if (num === 0) return '零';
  const neg = num < 0;
  const str = Math.abs(Math.floor(num)).toString();
  const sections: string[] = [];
  for (let i = str.length; i > 0; i -= 4) sections.unshift(str.slice(Math.max(0, i - 4), i));
  let result = sections.map((s, i) => {
    const c = convertSection(s, DIGITS, UNITS);
    return c ? c + BIG_UNITS[sections.length - 1 - i] : '';
  }).join('');
  result = result.replace(/零+/g, '零').replace(/零$/, '');
  return (neg ? '负' : '') + result;
}

export function numberToUpperChinese(num: number): string {
  if (num === 0) return '零元整';
  const neg = num < 0;
  const abs = Math.abs(num);
  const intPart = Math.floor(abs);
  const decPart = Math.round((abs - intPart) * 100);
  const str = intPart.toString();
  const sections: string[] = [];
  for (let i = str.length; i > 0; i -= 4) sections.unshift(str.slice(Math.max(0, i - 4), i));
  let result = sections.map((s, i) => {
    const c = convertSection(s, UPPER_DIGITS, UPPER_UNITS);
    return c ? c + UPPER_BIG[sections.length - 1 - i] : '';
  }).join('');
  result = result.replace(/零+/g, '零').replace(/零$/, '') + '元';
  if (decPart === 0) return (neg ? '负' : '') + result + '整';
  const jiao = Math.floor(decPart / 10);
  const fen = decPart % 10;
  if (jiao > 0) result += UPPER_DIGITS[jiao] + '角';
  if (fen > 0) result += UPPER_DIGITS[fen] + '分';
  return (neg ? '负' : '') + result;
}
