export function decodeThunder(url: string): string {
  if (url.startsWith('thunder://')) {
    try { const decoded = atob(url.slice(10)); return decoded.slice(2, -2); } catch { return 'Invalid Thunder URL'; }
  }
  if (url.startsWith('flashget://')) {
    try { const decoded = atob(url.slice(11).replace(/&.*$/, '')); return decoded.replace(/^\[FLASHGET\]/, '').replace(/\[FLASHGET\]$/, ''); } catch { return 'Invalid FlashGet URL'; }
  }
  return url;
}

export function encodeThunder(url: string): string {
  return 'thunder://' + btoa('AA' + url + 'ZZ');
}
