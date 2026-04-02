export type UuidFormat = 'standard' | 'no-dash' | 'uppercase' | 'lowercase';

export function generateUuid(format: UuidFormat = 'standard'): string {
  const uuid = crypto.randomUUID();
  switch (format) {
    case 'no-dash':
      return uuid.replace(/-/g, '');
    case 'uppercase':
      return uuid.toUpperCase();
    case 'lowercase':
      return uuid.toLowerCase();
    default:
      return uuid;
  }
}

export function generateBatch(count: number, format: UuidFormat = 'standard'): string[] {
  const clamped = Math.max(1, Math.min(count, 1000));
  return Array.from({ length: clamped }, () => generateUuid(format));
}
