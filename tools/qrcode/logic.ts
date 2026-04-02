// QR code generation requires a library (e.g., qrcode).
// This is a placeholder structure. Actual QR generation will be added
// when a suitable library is installed.

export interface QrConfig {
  text: string;
  size: number;
  fgColor: string;
  bgColor: string;
}

export function getDefaultConfig(): QrConfig {
  return { text: '', size: 256, fgColor: '#000000', bgColor: '#ffffff' };
}
