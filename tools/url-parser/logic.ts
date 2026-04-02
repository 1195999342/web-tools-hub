export interface ParsedURL {
  protocol: string; host: string; hostname: string; port: string;
  pathname: string; search: string; hash: string; origin: string;
  params: Record<string, string>;
}

export function parseURL(urlStr: string): ParsedURL | null {
  try {
    const u = new URL(urlStr);
    const params: Record<string, string> = {};
    u.searchParams.forEach((v, k) => { params[k] = v; });
    return { protocol: u.protocol, host: u.host, hostname: u.hostname, port: u.port, pathname: u.pathname, search: u.search, hash: u.hash, origin: u.origin, params };
  } catch { return null; }
}
