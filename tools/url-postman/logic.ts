// URL to Postman logic

export interface ParsedRequest {
  method: string;
  protocol: string;
  host: string;
  path: string;
  query: { key: string; value: string }[];
}

export function parseURL(url: string): ParsedRequest {
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url);
    const query: { key: string; value: string }[] = [];
    u.searchParams.forEach((v, k) => query.push({ key: k, value: v }));
    return {
      method: 'GET',
      protocol: u.protocol.replace(':', ''),
      host: u.hostname,
      path: u.pathname,
      query,
    };
  } catch {
    return { method: 'GET', protocol: 'https', host: '', path: '/', query: [] };
  }
}

export function toPostmanRequest(parsed: ParsedRequest): string {
  const collection = {
    info: {
      name: 'URL Import',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [{
      name: `${parsed.method} ${parsed.host}${parsed.path}`,
      request: {
        method: parsed.method,
        header: [],
        url: {
          raw: `${parsed.protocol}://${parsed.host}${parsed.path}${parsed.query.length ? '?' + parsed.query.map(q => `${q.key}=${q.value}`).join('&') : ''}`,
          protocol: parsed.protocol,
          host: parsed.host.split('.'),
          path: parsed.path.split('/').filter(Boolean),
          query: parsed.query,
        },
      },
    }],
  };
  return JSON.stringify(collection, null, 2);
}
