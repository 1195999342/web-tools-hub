// SVG Editor logic

export const defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#3B82F6" stroke="#1E40AF" stroke-width="4"/>
  <text x="100" y="110" text-anchor="middle" fill="white" font-size="24" font-family="sans-serif">SVG</text>
</svg>`;

export function validateSVG(code: string): boolean {
  if (typeof DOMParser === 'undefined') return true;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'image/svg+xml');
    return !doc.querySelector('parsererror');
  } catch {
    return false;
  }
}
