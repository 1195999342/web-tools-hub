export function autoTypeset(text: string): string {
  let result = text;
  // Add space between CJK and Latin/numbers
  result = result.replace(/([\u4e00-\u9fff\u3400-\u4dbf])([A-Za-z0-9])/g, '$1 $2');
  result = result.replace(/([A-Za-z0-9])([\u4e00-\u9fff\u3400-\u4dbf])/g, '$1 $2');
  // Fix full-width punctuation after Latin
  result = result.replace(/([A-Za-z0-9])\s*([，。！？；：])/g, '$1$2');
  return result;
}
