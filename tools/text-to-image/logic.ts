// Text to Image logic

export function renderTextToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  fontSize: number,
  textColor: string,
  bgColor: string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.font = `${fontSize}px sans-serif`;
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.4;
  const maxWidth = Math.max(200, ...lines.map(l => ctx.measureText(l).width)) + 40;
  const totalHeight = lines.length * lineHeight + 40;

  canvas.width = maxWidth;
  canvas.height = totalHeight;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = textColor;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textBaseline = 'top';

  lines.forEach((line, i) => {
    ctx.fillText(line, 20, 20 + i * lineHeight);
  });
}
