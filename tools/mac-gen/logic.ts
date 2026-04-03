// MAC Address Generator logic

export type MacFormat = 'colon' | 'dash' | 'none';

function randomByte(): string {
  return Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
}

export function generateMAC(format: MacFormat): string {
  const bytes = Array.from({ length: 6 }, randomByte);
  switch (format) {
    case 'colon': return bytes.join(':');
    case 'dash': return bytes.join('-');
    case 'none': return bytes.join('');
  }
}

export function generateBatch(count: number, format: MacFormat): string[] {
  return Array.from({ length: Math.min(count, 100) }, () => generateMAC(format));
}
