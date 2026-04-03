export function highlightJSON(input: string): { html?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    const html = formatted
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"([^"]+)"(?=\s*:)/g, '<span style="color:#9c27b0">"$1"</span>')
      .replace(/:\s*"([^"]*)"/g, ': <span style="color:#2e7d32">"$1"</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#1565c0">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span style="color:#e65100">$1</span>')
      .replace(/:\s*(null)/g, ': <span style="color:#757575">$1</span>');
    return { html };
  } catch (e) { return { error: (e as Error).message }; }
}
