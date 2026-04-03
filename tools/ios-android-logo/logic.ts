// App Icon Generator logic

export interface IconSize {
  platform: string;
  name: string;
  size: number;
}

export const iconSizes: IconSize[] = [
  // iOS
  { platform: 'iOS', name: 'iPhone Notification', size: 40 },
  { platform: 'iOS', name: 'iPhone Settings', size: 58 },
  { platform: 'iOS', name: 'iPhone Spotlight', size: 80 },
  { platform: 'iOS', name: 'iPhone App', size: 120 },
  { platform: 'iOS', name: 'iPad App', size: 152 },
  { platform: 'iOS', name: 'iPad Pro App', size: 167 },
  { platform: 'iOS', name: 'App Store', size: 1024 },
  // Android
  { platform: 'Android', name: 'LDPI', size: 36 },
  { platform: 'Android', name: 'MDPI', size: 48 },
  { platform: 'Android', name: 'HDPI', size: 72 },
  { platform: 'Android', name: 'XHDPI', size: 96 },
  { platform: 'Android', name: 'XXHDPI', size: 144 },
  { platform: 'Android', name: 'XXXHDPI', size: 192 },
  { platform: 'Android', name: 'Play Store', size: 512 },
];

export function resizeImage(img: HTMLImageElement, size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) ctx.drawImage(img, 0, 0, size, size);
  return canvas.toDataURL('image/png');
}
