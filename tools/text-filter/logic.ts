export interface FilterOptions {
  keepChinese: boolean; keepEnglish: boolean; keepDigits: boolean; keepPunctuation: boolean; keepSpaces: boolean;
}

export function filterText(text: string, options: FilterOptions): string {
  return text.split('').filter(ch => {
    if (options.keepChinese && /[\u4e00-\u9fff\u3400-\u4dbf]/.test(ch)) return true;
    if (options.keepEnglish && /[A-Za-z]/.test(ch)) return true;
    if (options.keepDigits && /[0-9]/.test(ch)) return true;
    if (options.keepPunctuation && /[^\w\s\u4e00-\u9fff\u3400-\u4dbf]/.test(ch)) return true;
    if (options.keepSpaces && /\s/.test(ch)) return true;
    return false;
  }).join('');
}
