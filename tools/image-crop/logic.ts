export interface CropRect { x: number; y: number; width: number; height: number; }

export const ASPECT_RATIOS = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:2', value: 3 / 2 },
];

export function cropImage(img: HTMLImageElement, rect: CropRect, outputType: string = 'image/png'): string {
  const canvas = document.createElement('canvas');
  canvas.width = rect.width;
  canvas.height = rect.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
  return canvas.toDataURL(outputType);
}
