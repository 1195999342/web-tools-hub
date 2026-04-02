export interface BadgeConfig {
  label: string; message: string; color: string; style: string; labelColor: string;
}

export function generateBadgeUrl(config: BadgeConfig): string {
  const { label, message, color, style, labelColor } = config;
  const params = new URLSearchParams();
  if (style !== 'flat') params.set('style', style);
  if (labelColor !== '555') params.set('labelColor', labelColor);
  const base = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}`;
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function generateMarkdown(url: string, alt: string): string {
  return `![${alt}](${url})`;
}

export const STYLES = ['flat', 'flat-square', 'plastic', 'for-the-badge', 'social'];
export const COLORS = ['brightgreen', 'green', 'yellow', 'orange', 'red', 'blue', 'lightgrey', 'blueviolet', 'ff69b4', '9cf'];
