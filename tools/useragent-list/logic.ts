// UserAgent List logic

export interface UAEntry {
  browser: string;
  os: string;
  ua: string;
}

export const commonUAs: UAEntry[] = [
  { browser: 'Chrome 120', os: 'Windows 10', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { browser: 'Chrome 120', os: 'macOS', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { browser: 'Chrome 120', os: 'Linux', ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
  { browser: 'Firefox 121', os: 'Windows 10', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0' },
  { browser: 'Firefox 121', os: 'macOS', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0' },
  { browser: 'Safari 17', os: 'macOS', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15' },
  { browser: 'Safari 17', os: 'iOS', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1' },
  { browser: 'Edge 120', os: 'Windows 10', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' },
  { browser: 'Chrome', os: 'Android', ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36' },
  { browser: 'Googlebot', os: 'Bot', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
  { browser: 'Bingbot', os: 'Bot', ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)' },
  { browser: 'curl', os: 'CLI', ua: 'curl/8.4.0' },
];

export function filterUAs(query: string): UAEntry[] {
  if (!query.trim()) return commonUAs;
  const q = query.toLowerCase();
  return commonUAs.filter(e => e.browser.toLowerCase().includes(q) || e.os.toLowerCase().includes(q) || e.ua.toLowerCase().includes(q));
}
