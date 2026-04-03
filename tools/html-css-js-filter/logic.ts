// HTML/CSS/JS Filter logic

export type FilterMode = 'js' | 'css' | 'text';

export function filterHTML(html: string, mode: FilterMode): string {
  switch (mode) {
    case 'js': {
      const scripts: string[] = [];
      // Inline scripts
      const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
      let m;
      while ((m = scriptRegex.exec(html)) !== null) {
        const content = m[1].trim();
        if (content) scripts.push(content);
      }
      // Script src attributes
      const srcRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
      while ((m = srcRegex.exec(html)) !== null) {
        scripts.push(`// External: ${m[1]}`);
      }
      return scripts.join('\n\n') || '// No JavaScript found';
    }
    case 'css': {
      const styles: string[] = [];
      // Inline styles
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      let m;
      while ((m = styleRegex.exec(html)) !== null) {
        const content = m[1].trim();
        if (content) styles.push(content);
      }
      // Link stylesheets
      const linkRegex = /<link[^>]+href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;
      while ((m = linkRegex.exec(html)) !== null) {
        styles.push(`/* External: ${m[1]} */`);
      }
      return styles.join('\n\n') || '/* No CSS found */';
    }
    case 'text': {
      // Strip all tags
      return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || '(No text content found)';
    }
  }
}
