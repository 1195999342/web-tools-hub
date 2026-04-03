// Image Rotate logic

export function rotateImage(canvas: HTMLCanvasElement, img: HTMLImageElement, degrees: number, flipH: boolean, flipV: boolean): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rad = (degrees * Math.PI) / 180;
  const isRightAngle = degrees % 180 !== 0;
  canvas.width = isRightAngle ? img.naturalHeight : img.naturalWidth;
  canvas.height = isRightAngle ? img.naturalWidth : img.naturalHeight;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();
}
