export function cookieToJs(cookie: string): string {
  return cookie.split(';').map(s => s.trim()).filter(Boolean).map(pair => {
    const [k, ...v] = pair.split('=');
    return `document.cookie = "${k.trim()}=${v.join('=').trim()}";`;
  }).join('\n');
}
