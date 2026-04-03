export interface FeatureCheck {
  name: string;
  category: string;
  check: () => boolean;
}

export function getFeatureChecks(): FeatureCheck[] {
  if (typeof window === 'undefined') return [];
  return [
    { name: 'Canvas 2D', category: 'Graphics', check: () => { const c = document.createElement('canvas'); return !!c.getContext?.('2d'); } },
    { name: 'WebGL', category: 'Graphics', check: () => { const c = document.createElement('canvas'); return !!(c.getContext?.('webgl') || c.getContext?.('experimental-webgl')); } },
    { name: 'WebGL 2', category: 'Graphics', check: () => { const c = document.createElement('canvas'); return !!c.getContext?.('webgl2'); } },
    { name: 'SVG', category: 'Graphics', check: () => !!document.createElementNS?.('http://www.w3.org/2000/svg', 'svg').createSVGRect },
    { name: 'Web Workers', category: 'Performance', check: () => !!window.Worker },
    { name: 'Service Workers', category: 'Performance', check: () => 'serviceWorker' in navigator },
    { name: 'SharedArrayBuffer', category: 'Performance', check: () => !!window.SharedArrayBuffer },
    { name: 'WebAssembly', category: 'Performance', check: () => !!window.WebAssembly },
    { name: 'localStorage', category: 'Storage', check: () => { try { return !!window.localStorage; } catch { return false; } } },
    { name: 'sessionStorage', category: 'Storage', check: () => { try { return !!window.sessionStorage; } catch { return false; } } },
    { name: 'IndexedDB', category: 'Storage', check: () => !!window.indexedDB },
    { name: 'Cache API', category: 'Storage', check: () => 'caches' in window },
    { name: 'Fetch API', category: 'Network', check: () => !!window.fetch },
    { name: 'WebSocket', category: 'Network', check: () => !!window.WebSocket },
    { name: 'Beacon API', category: 'Network', check: () => !!navigator.sendBeacon },
    { name: 'Geolocation', category: 'Device', check: () => !!navigator.geolocation },
    { name: 'Clipboard API', category: 'Device', check: () => !!navigator.clipboard },
    { name: 'Vibration API', category: 'Device', check: () => !!navigator.vibrate },
    { name: 'Gamepad API', category: 'Device', check: () => !!navigator.getGamepads },
    { name: 'Notifications', category: 'Device', check: () => !!window.Notification },
    { name: 'Web Audio', category: 'Media', check: () => !!(window.AudioContext || (window as any).webkitAudioContext) },
    { name: 'Media Recorder', category: 'Media', check: () => !!window.MediaRecorder },
    { name: 'getUserMedia', category: 'Media', check: () => !!navigator.mediaDevices?.getUserMedia },
    { name: 'Fullscreen API', category: 'Media', check: () => !!document.documentElement.requestFullscreen },
    { name: 'Intersection Observer', category: 'DOM', check: () => !!window.IntersectionObserver },
    { name: 'Resize Observer', category: 'DOM', check: () => !!window.ResizeObserver },
    { name: 'MutationObserver', category: 'DOM', check: () => !!window.MutationObserver },
    { name: 'Custom Elements', category: 'DOM', check: () => !!window.customElements },
    { name: 'Shadow DOM', category: 'DOM', check: () => !!HTMLElement.prototype.attachShadow },
    { name: 'CSS Grid', category: 'CSS', check: () => CSS.supports?.('display', 'grid') ?? false },
    { name: 'CSS Flexbox', category: 'CSS', check: () => CSS.supports?.('display', 'flex') ?? false },
    { name: 'CSS Container Queries', category: 'CSS', check: () => CSS.supports?.('container-type', 'inline-size') ?? false },
  ];
}
