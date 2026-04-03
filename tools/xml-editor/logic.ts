export interface XmlResult {
  output: string;
  valid: boolean;
  error?: string;
}

function getDOMParser(): DOMParser | null {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return null;
  return new DOMParser();
}

export function formatXml(xml: string): XmlResult {
  const parser = getDOMParser();
  if (!parser) return { output: xml, valid: true };
  try {
    const doc = parser.parseFromString(xml, 'application/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) return { output: xml, valid: false, error: errorNode.textContent || 'Invalid XML' };
    const serializer = new XMLSerializer();
    const raw = serializer.serializeToString(doc);
    let formatted = '';
    let indent = 0;
    const parts = raw.replace(/(>)(<)/g, '$1\n$2').split('\n');
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('</')) indent = Math.max(0, indent - 1);
      formatted += '  '.repeat(indent) + trimmed + '\n';
      if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<?') && !trimmed.endsWith('/>') && !/<\/[^>]+>$/.test(trimmed)) indent++;
    }
    return { output: formatted.trim(), valid: true };
  } catch (e) {
    return { output: xml, valid: false, error: (e as Error).message };
  }
}

export function minifyXml(xml: string): XmlResult {
  const parser = getDOMParser();
  if (!parser) return { output: xml, valid: true };
  try {
    const doc = parser.parseFromString(xml, 'application/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) return { output: xml, valid: false, error: errorNode.textContent || 'Invalid XML' };
    const serializer = new XMLSerializer();
    return { output: serializer.serializeToString(doc).replace(/>\s+</g, '><').trim(), valid: true };
  } catch (e) {
    return { output: xml, valid: false, error: (e as Error).message };
  }
}

export function validateXml(xml: string): { valid: boolean; error?: string } {
  if (!xml.trim()) return { valid: true };
  const parser = getDOMParser();
  if (!parser) return { valid: true };
  const doc = parser.parseFromString(xml, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) return { valid: false, error: errorNode.textContent || 'Invalid XML' };
  return { valid: true };
}
