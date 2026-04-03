// Check Date logic
export const TOOL_NAME = 'check-date';

const UPPER_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const MONTHS = ['', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '壹拾', '壹拾壹', '壹拾贰'];
const DAY_TENS = ['', '壹拾', '贰拾', '叁拾'];

export function toChineseUpperDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const yearStr = String(y).split('').map(c => UPPER_DIGITS[parseInt(c)]).join('');
  const monthStr = MONTHS[m];
  const dayStr = d < 10 ? UPPER_DIGITS[d] : DAY_TENS[Math.floor(d / 10)] + (d % 10 === 0 ? '' : UPPER_DIGITS[d % 10]);
  return `${yearStr}年${monthStr}月${dayStr}日`;
}
