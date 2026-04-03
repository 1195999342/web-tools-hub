export function parseUrlParams(url: string): { key: string; value: string }[] {
  try {
    const u = new URL(url.startsWith('http') ? url : 'http://x.com?' + url);
    const result: { key: string; value: string }[] = [];
    u.searchParams.forEach((v, k) => result.push({ key: k, value: v }));
    return result;
  } catch { return []; }
}

export function buildQueryString(params: { key: string; value: string }[]): string {
  const sp = new URLSearchParams();
  params.forEach(p => { if (p.key) sp.append(p.key, p.value); });
  return sp.toString();
}
