// Font Viewer logic

export async function loadFontFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const fontName = 'CustomFont_' + Date.now();
  const font = new FontFace(fontName, buffer);
  await font.load();
  document.fonts.add(font);
  return fontName;
}
