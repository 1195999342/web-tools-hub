// Placeholder Image logic

export function generatePlaceholder(canvas: HTMLCanvasElement, width: number, height: number, bgColor: string, textColor: string, text: string): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  const label = text || `${width}×${height}`;
  const fontSize = Math.max(12, Math.min(width, height) / 8);
  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, width / 2, height / 2);
}
