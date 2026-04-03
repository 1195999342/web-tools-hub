// Robots.txt Checker logic

interface ParsedRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

function parseRobotsTxt(txt: string): ParsedRule[] {
  const rules: ParsedRule[] = [];
  let current: ParsedRule | null = null;
  for (const raw of txt.split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [key, ...rest] = line.split(':');
    const val = rest.join(':').trim();
    const k = key.trim().toLowerCase();
    if (k === 'user-agent') {
      current = { userAgent: val, allow: [], disallow: [] };
      rules.push(current);
    } else if (current) {
      if (k === 'allow') current.allow.push(val);
      else if (k === 'disallow') current.disallow.push(val);
    }
  }
  return rules;
}

function pathMatches(pattern: string, path: string): boolean {
  if (!pattern) return false;
  if (pattern === '/') return true;
  // Simple prefix match (covers most real-world cases)
  if (pattern.endsWith('*')) {
    return path.startsWith(pattern.slice(0, -1));
  }
  if (pattern.endsWith('$')) {
    return path === pattern.slice(0, -1);
  }
  return path.startsWith(pattern);
}

export function checkAccess(robotsTxt: string, url: string, userAgent: string): { allowed: boolean; reason: string } {
  const rules = parseRobotsTxt(robotsTxt);
  if (rules.length === 0) return { allowed: true, reason: 'No rules found — everything is allowed.' };

  let path: string;
  try {
    path = new URL(url.startsWith('http') ? url : 'http://example.com' + url).pathname;
  } catch {
    path = url.startsWith('/') ? url : '/' + url;
  }

  const ua = userAgent.toLowerCase();
  // Find matching rules: specific UA first, then wildcard
  const specific = rules.filter(r => r.userAgent.toLowerCase() === ua);
  const wildcard = rules.filter(r => r.userAgent === '*');
  const applicable = specific.length > 0 ? specific : wildcard;

  if (applicable.length === 0) return { allowed: true, reason: 'No matching user-agent rules found.' };

  for (const rule of applicable) {
    // Check allow first (more specific)
    for (const p of rule.allow) {
      if (pathMatches(p, path)) return { allowed: true, reason: `Allowed by: Allow: ${p}` };
    }
    for (const p of rule.disallow) {
      if (pathMatches(p, path)) return { allowed: false, reason: `Blocked by: Disallow: ${p}` };
    }
  }
  return { allowed: true, reason: 'No matching disallow rule — allowed by default.' };
}
