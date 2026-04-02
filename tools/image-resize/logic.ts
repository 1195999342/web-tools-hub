export function resizeImage(img: HTMLImageElement, width: number, height: number, format: string = 'image/png'): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL(format);
}

export function calcDimensions(origW: number, origH: number, newW: number, newH: number, lockAspect: boolean): { width: number; height: number } {
  if (!lockAspect) return { width: newW, height: newH };
  const ratio = origW / origH;
  if (newW !== origW) return { width: newW, height: Math.round(newW / ratio) };
  return { width: Math.round(newH * ratio), height: newH };
}
