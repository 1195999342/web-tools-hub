// UserAgent Generator logic

const browsers: Record<string, { versions: string[]; engines: string[] }> = {
  Chrome: { versions: ['120.0.0.0', '119.0.0.0', '118.0.0.0', '117.0.0.0'], engines: ['AppleWebKit/537.36 (KHTML, like Gecko)'] },
  Firefox: { versions: ['121.0', '120.0', '119.0', '118.0'], engines: ['Gecko/20100101'] },
  Safari: { versions: ['17.2', '17.1', '17.0', '16.6'], engines: ['AppleWebKit/605.1.15 (KHTML, like Gecko)'] },
  Edge: { versions: ['120.0.0.0', '119.0.0.0', '118.0.0.0'], engines: ['AppleWebKit/537.36 (KHTML, like Gecko)'] },
};

const osList: Record<string, string[]> = {
  Windows: ['Windows NT 10.0; Win64; x64', 'Windows NT 11.0; Win64; x64'],
  macOS: ['Macintosh; Intel Mac OS X 10_15_7', 'Macintosh; Intel Mac OS X 14_0'],
  Linux: ['X11; Linux x86_64', 'X11; Ubuntu; Linux x86_64'],
  Android: ['Linux; Android 14; Pixel 8', 'Linux; Android 13; SM-S918B'],
  iOS: ['iPhone; CPU iPhone OS 17_2 like Mac OS X', 'iPad; CPU OS 17_2 like Mac OS X'],
};

export function getBrowserNames(): string[] {
  return Object.keys(browsers);
}

export function getOSNames(): string[] {
  return Object.keys(osList);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateUA(browser: string, os: string): string {
  const b = browsers[browser];
  const o = osList[os];
  if (!b || !o) return '';
  const osStr = pick(o);
  const ver = pick(b.versions);
  switch (browser) {
    case 'Chrome':
      return `Mozilla/5.0 (${osStr}) ${b.engines[0]} Chrome/${ver} Safari/537.36`;
    case 'Firefox':
      return `Mozilla/5.0 (${osStr}; rv:${ver}) ${b.engines[0]} Firefox/${ver}`;
    case 'Safari':
      return `Mozilla/5.0 (${osStr}) ${b.engines[0]} Version/${ver} Safari/605.1.15`;
    case 'Edge':
      return `Mozilla/5.0 (${osStr}) ${b.engines[0]} Chrome/${ver} Safari/537.36 Edg/${ver}`;
    default:
      return '';
  }
}
