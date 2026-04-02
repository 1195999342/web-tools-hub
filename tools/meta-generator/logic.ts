export interface MetaConfig {
  title: string; description: string; keywords: string; author: string;
  ogTitle: string; ogDescription: string; ogImage: string; ogUrl: string;
  twitterCard: string; twitterTitle: string; twitterDescription: string;
}

export function generateMetaTags(config: MetaConfig): string {
  const lines: string[] = [];
  if (config.title) lines.push(`<title>${config.title}</title>`);
  if (config.description) lines.push(`<meta name="description" content="${config.description}" />`);
  if (config.keywords) lines.push(`<meta name="keywords" content="${config.keywords}" />`);
  if (config.author) lines.push(`<meta name="author" content="${config.author}" />`);
  if (config.ogTitle) lines.push(`<meta property="og:title" content="${config.ogTitle}" />`);
  if (config.ogDescription) lines.push(`<meta property="og:description" content="${config.ogDescription}" />`);
  if (config.ogImage) lines.push(`<meta property="og:image" content="${config.ogImage}" />`);
  if (config.ogUrl) lines.push(`<meta property="og:url" content="${config.ogUrl}" />`);
  if (config.twitterCard) lines.push(`<meta name="twitter:card" content="${config.twitterCard}" />`);
  if (config.twitterTitle) lines.push(`<meta name="twitter:title" content="${config.twitterTitle}" />`);
  if (config.twitterDescription) lines.push(`<meta name="twitter:description" content="${config.twitterDescription}" />`);
  return lines.join('\n');
}
