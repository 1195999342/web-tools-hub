export function toISO8601(date: Date): string { return date.toISOString(); }
export function toRFC2822(date: Date): string { return date.toUTCString(); }
export function toUnix(date: Date): number { return Math.floor(date.getTime() / 1000); }
export function toUnixMs(date: Date): number { return date.getTime(); }

export function fromISO(str: string): Date | null {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

export function timeDiff(d1: Date, d2: Date): string {
  const diff = Math.abs(d2.getTime() - d1.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export function convertTimezone(date: Date, tz: string): string {
  try { return date.toLocaleString('en-US', { timeZone: tz }); } catch { return 'Invalid timezone'; }
}

export const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Australia/Sydney'];
