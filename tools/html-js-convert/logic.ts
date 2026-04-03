export function htmlToJsString(html: string): string {
  return html.split('\n').map(line => `'${line.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`).join(' +\n');
}

export function jsStringToHtml(js: string): string {
  return js.replace(/['"]\s*\+\s*\n?\s*['"]/g, '\n').replace(/^['"]|['"]$/gm, '').replace(/\\'/g, "'").replace(/\\"/g, '"');
}
