export function compressImage(img: HTMLImageElement, quality: number, format: string = 'image/jpeg'): { dataUrl: string; size: number } {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  const dataUrl = canvas.toDataURL(format, quality / 100);
  const size = Math.round((dataUrl.length - `data:${format};base64,`.length) * 0.75);
  return { dataUrl, size };
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
