// Image Watermark logic

export type WatermarkPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export function applyWatermark(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  text: string,
  fontSize: number,
  color: string,
  opacity: number,
  position: WatermarkPosition
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const th = fontSize;
  const pad = 20;

  let x = 0, y = 0;
  switch (position) {
    case 'center': x = (canvas.width - tw) / 2; y = canvas.height / 2; break;
    case 'top-left': x = pad; y = pad + th / 2; break;
    case 'top-right': x = canvas.width - tw - pad; y = pad + th / 2; break;
    case 'bottom-left': x = pad; y = canvas.height - pad - th / 2; break;
    case 'bottom-right': x = canvas.width - tw - pad; y = canvas.height - pad - th / 2; break;
  }
  ctx.fillText(text, x, y);
  ctx.globalAlpha = 1;
}
