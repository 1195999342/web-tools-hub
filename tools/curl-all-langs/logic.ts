// curl All Languages logic

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  data: string;
}

export function parseCurl(cmd: string): ParsedCurl {
  const result: ParsedCurl = { method: 'GET', url: '', headers: {}, data: '' };
  const tokens: string[] = [];
  let current = '';
  let inQuote = '';
  for (const ch of cmd) {
    if (!inQuote && (ch === '"' || ch === "'")) { inQuote = ch; continue; }
    if (ch === inQuote) { inQuote = ''; continue; }
    if (!inQuote && ch === ' ') { if (current) tokens.push(current); current = ''; continue; }
    current += ch;
  }
  if (current) tokens.push(current);

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === 'curl') continue;
    if (t === '-X' || t === '--request') { result.method = tokens[++i]?.toUpperCase() || 'GET'; }
    else if (t === '-H' || t === '--header') {
      const h = tokens[++i] || '';
      const idx = h.indexOf(':');
      if (idx > 0) result.headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
    }
    else if (t === '-d' || t === '--data' || t === '--data-raw') { result.data = tokens[++i] || ''; if (!result.method || result.method === 'GET') result.method = 'POST'; }
    else if (t.startsWith('http')) result.url = t;
  }
  return result;
}

export type Lang = 'python' | 'javascript' | 'go' | 'java' | 'php' | 'ruby' | 'csharp';
export const langList: { value: Lang; label: string }[] = [
  { value: 'python', label: 'Python' }, { value: 'javascript', label: 'JavaScript (fetch)' },
  { value: 'go', label: 'Go' }, { value: 'java', label: 'Java' },
  { value: 'php', label: 'PHP' }, { value: 'ruby', label: 'Ruby' }, { value: 'csharp', label: 'C#' },
];

export function toLanguage(parsed: ParsedCurl, lang: Lang): string {
  const { method, url, headers, data } = parsed;
  const hdrs = Object.entries(headers);
  switch (lang) {
    case 'python': {
      let s = `import requests\n\n`;
      if (hdrs.length) s += `headers = {\n${hdrs.map(([k, v]) => `    "${k}": "${v}"`).join(',\n')}\n}\n\n`;
      s += `response = requests.${method.toLowerCase()}("${url}"`;
      if (hdrs.length) s += `, headers=headers`;
      if (data) s += `, data='${data}'`;
      s += `)\nprint(response.text)`;
      return s;
    }
    case 'javascript': {
      let s = `fetch("${url}", {\n  method: "${method}"`;
      if (hdrs.length) s += `,\n  headers: {\n${hdrs.map(([k, v]) => `    "${k}": "${v}"`).join(',\n')}\n  }`;
      if (data) s += `,\n  body: '${data}'`;
      s += `\n})\n  .then(res => res.text())\n  .then(console.log);`;
      return s;
    }
    case 'go': {
      let s = `package main\n\nimport (\n    "fmt"\n    "io"\n    "net/http"\n`;
      if (data) s += `    "strings"\n`;
      s += `)\n\nfunc main() {\n`;
      if (data) s += `    body := strings.NewReader(\`${data}\`)\n    req, _ := http.NewRequest("${method}", "${url}", body)\n`;
      else s += `    req, _ := http.NewRequest("${method}", "${url}", nil)\n`;
      for (const [k, v] of hdrs) s += `    req.Header.Set("${k}", "${v}")\n`;
      s += `    resp, _ := http.DefaultClient.Do(req)\n    defer resp.Body.Close()\n    b, _ := io.ReadAll(resp.Body)\n    fmt.Println(string(b))\n}`;
      return s;
    }
    case 'java': {
      let s = `HttpRequest request = HttpRequest.newBuilder()\n    .uri(URI.create("${url}"))\n    .method("${method}"`;
      if (data) s += `, HttpRequest.BodyPublishers.ofString("${data}")`;
      else s += `, HttpRequest.BodyPublishers.noBody()`;
      s += `)\n`;
      for (const [k, v] of hdrs) s += `    .header("${k}", "${v}")\n`;
      s += `    .build();\nHttpResponse<String> response = HttpClient.newHttpClient()\n    .send(request, HttpResponse.BodyHandlers.ofString());\nSystem.out.println(response.body());`;
      return s;
    }
    case 'php':
      return `<?php\n$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n${hdrs.length ? `curl_setopt($ch, CURLOPT_HTTPHEADER, [\n${hdrs.map(([k, v]) => `    "${k}: ${v}"`).join(',\n')}\n]);\n` : ''}${data ? `curl_setopt($ch, CURLOPT_POSTFIELDS, '${data}');\n` : ''}$response = curl_exec($ch);\ncurl_close($ch);\necho $response;\n?>`;
    case 'ruby':
      return `require 'net/http'\nrequire 'uri'\n\nuri = URI.parse("${url}")\nhttp = Net::HTTP.new(uri.host, uri.port)\n${url.startsWith('https') ? 'http.use_ssl = true\n' : ''}request = Net::HTTP::${method.charAt(0) + method.slice(1).toLowerCase()}.new(uri.request_uri)\n${hdrs.map(([k, v]) => `request["${k}"] = "${v}"`).join('\n')}\n${data ? `request.body = '${data}'\n` : ''}response = http.request(request)\nputs response.body`;
    case 'csharp':
      return `using var client = new HttpClient();\n${hdrs.map(([k, v]) => `client.DefaultRequestHeaders.Add("${k}", "${v}");`).join('\n')}\n${data ? `var content = new StringContent("${data}");\nvar response = await client.${method === 'POST' ? 'PostAsync' : method === 'PUT' ? 'PutAsync' : 'SendAsync'}("${url}"${method === 'POST' || method === 'PUT' ? ', content' : ''});` : `var response = await client.GetAsync("${url}");`}\nvar body = await response.Content.ReadAsStringAsync();\nConsole.WriteLine(body);`;
  }
}
