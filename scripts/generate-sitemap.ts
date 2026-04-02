import * as fs from 'fs';
import * as path from 'path';
import { getEnabledTools } from '../tools/registry';
import { locales } from '../i18n';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://webtools.dev';
const OUT_DIR = path.resolve(__dirname, '..', 'out');

function generateSitemap(): string {
  const tools = getEnabledTools();
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  for (const tool of tools) {
    for (const locale of locales) {
      lines.push('  <url>');
      lines.push(`    <loc>${SITE_URL}/${locale}/tools/${tool.slug}/</loc>`);
      for (const alt of locales) {
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}/${alt}/tools/${tool.slug}/" />`
        );
      }
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/tools/${tool.slug}/" />`
      );
      lines.push('  </url>');
    }
  }

  // Add homepage for each locale
  for (const locale of locales) {
    lines.push('  <url>');
    lines.push(`    <loc>${SITE_URL}/${locale}/</loc>`);
    for (const alt of locales) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}/${alt}/" />`
      );
    }
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/" />`
    );
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n');
}

const sitemap = generateSitemap();
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`✓ sitemap.xml generated (${sitemap.length} bytes)`);
