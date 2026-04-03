// Image Color Picker logic

export function getPixelColor(canvas: HTMLCanvasElement, x: number, y: number): { hex: string; rgb: string } {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { hex: '#000000', rgb: 'rgb(0,0,0)' };
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const r = pixel[0], g = pixel[1], b = pixel[2];
  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  return { hex, rgb: `rgb(${r}, ${g}, ${b})` };
}

export function drawImageToCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
}
