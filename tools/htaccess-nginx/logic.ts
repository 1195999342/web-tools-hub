export function convertHtaccessToNginx(htaccess: string): string {
  const lines = htaccess.split('\n');
  const nginx: string[] = ['# Converted from .htaccess'];
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) { nginx.push(t ? `# ${t.slice(1).trim()}` : ''); continue; }
    if (t.startsWith('RewriteRule')) {
      const parts = t.split(/\s+/);
      if (parts.length >= 3) nginx.push(`rewrite ^${parts[1]}$ ${parts[2]} last;`);
    } else if (t.startsWith('Redirect')) {
      const parts = t.split(/\s+/);
      if (parts.length >= 3) nginx.push(`return 301 ${parts[2]};`);
    } else if (t.startsWith('Options')) {
      nginx.push(`# ${t}`);
    } else if (t.startsWith('Header')) {
      const m = t.match(/Header\s+set\s+(\S+)\s+"?([^"]+)"?/);
      if (m) nginx.push(`add_header ${m[1]} "${m[2]}";`);
    } else if (t.startsWith('ErrorDocument')) {
      const parts = t.split(/\s+/);
      if (parts.length >= 3) nginx.push(`error_page ${parts[1]} ${parts[2]};`);
    } else {
      nginx.push(`# ${t}`);
    }
  }
  return nginx.join('\n');
}
