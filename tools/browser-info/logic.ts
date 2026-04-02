export interface BrowserData {
  userAgent: string; platform: string; language: string; languages: string[];
  cookieEnabled: boolean; onLine: boolean; hardwareConcurrency: number;
  screenWidth: number; screenHeight: number; viewportWidth: number; viewportHeight: number;
  colorDepth: number; pixelRatio: number; touchSupport: boolean;
}

export function getBrowserInfo(): BrowserData {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const scr = typeof screen !== 'undefined' ? screen : null;
  return {
    userAgent: nav?.userAgent ?? '', platform: nav?.platform ?? '',
    language: nav?.language ?? '', languages: Array.from(nav?.languages ?? []),
    cookieEnabled: nav?.cookieEnabled ?? false, onLine: nav?.onLine ?? false,
    hardwareConcurrency: nav?.hardwareConcurrency ?? 0,
    screenWidth: scr?.width ?? 0, screenHeight: scr?.height ?? 0,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    colorDepth: scr?.colorDepth ?? 0,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    touchSupport: typeof window !== 'undefined' ? 'ontouchstart' in window : false,
  };
}
