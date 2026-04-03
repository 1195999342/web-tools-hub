// Grid Cutter logic

export function cutImageToGrid(canvas: HTMLCanvasElement, img: HTMLImageElement, cols: number, rows: number): string[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const pieceW = Math.floor(img.naturalWidth / cols);
  const pieceH = Math.floor(img.naturalHeight / rows);
  const pieces: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = pieceW;
      tempCanvas.height = pieceH;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) continue;
      tCtx.drawImage(canvas, c * pieceW, r * pieceH, pieceW, pieceH, 0, 0, pieceW, pieceH);
      pieces.push(tempCanvas.toDataURL('image/png'));
    }
  }
  return pieces;
}
