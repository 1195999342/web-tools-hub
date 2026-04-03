// Web Safe Colors logic

export function generateWebSafeColors(): string[] {
  const vals = ['00', '33', '66', '99', 'CC', 'FF'];
  const colors: string[] = [];
  for (const r of vals)
    for (const g of vals)
      for (const b of vals)
        colors.push(`#${r}${g}${b}`);
  return colors;
}

export function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.5 ? '#000000' : '#FFFFFF';
}
