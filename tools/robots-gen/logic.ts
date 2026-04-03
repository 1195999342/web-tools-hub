// Robots.txt Generator logic

export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export function generateRobotsTxt(rules: RobotsRule[], sitemapUrl: string): string {
  const lines: string[] = [];
  for (const rule of rules) {
    lines.push(`User-agent: ${rule.userAgent || '*'}`);
    for (const p of rule.disallow) { if (p.trim()) lines.push(`Disallow: ${p.trim()}`); }
    for (const p of rule.allow) { if (p.trim()) lines.push(`Allow: ${p.trim()}`); }
    lines.push('');
  }
  if (sitemapUrl.trim()) lines.push(`Sitemap: ${sitemapUrl.trim()}`);
  return lines.join('\n');
}
