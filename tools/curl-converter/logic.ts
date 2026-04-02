export interface CurlParsed {
  method: string; url: string; headers: Record<string, string>; body: string;
}

export function parseCurl(curl: string): CurlParsed | null {
  try {
    const result: CurlParsed = { method: 'GET', url: '', headers: {}, body: '' };
    const tokens = curl.replace(/\\\n/g, ' ').trim().split(/\s+/);
    let i = 0;
    while (i < tokens.length) {
      const t = tokens[i];
      if (t === 'curl') { i++; continue; }
      if (t === '-X' || t === '--request') { result.method = tokens[++i]; i++; continue; }
      if (t === '-H' || t === '--header') { const h = tokens[++i].replace(/^['"]|['"]$/g, ''); const [k, ...v] = h.split(':'); result.headers[k.trim()] = v.join(':').trim(); i++; continue; }
      if (t === '-d' || t === '--data' || t === '--data-raw') { result.body = tokens[++i].replace(/^['"]|['"]$/g, ''); if (result.method === 'GET') result.method = 'POST'; i++; continue; }
      if (!t.startsWith('-')) { result.url = t.replace(/^['"]|['"]$/g, ''); }
      i++;
    }
    return result.url ? result : null;
  } catch { return null; }
}

export function toJavaScript(p: CurlParsed): string {
  const headers = JSON.stringify(p.headers, null, 2);
  const opts = [`method: '${p.method}'`, `headers: ${headers}`];
  if (p.body) opts.push(`body: '${p.body}'`);
  return `const response = await fetch('${p.url}', {\n  ${opts.join(',\n  ')}\n});\nconst data = await response.json();`;
}

export function toPython(p: CurlParsed): string {
  const headers = JSON.stringify(p.headers, null, 2);
  const body = p.body ? `\ndata = '${p.body}'` : '';
  const bodyArg = p.body ? ', data=data' : '';
  return `import requests\n\nheaders = ${headers}${body}\nresponse = requests.${p.method.toLowerCase()}('${p.url}', headers=headers${bodyArg})\nprint(response.json())`;
}
