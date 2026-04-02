export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export type TimestampUnit = 'seconds' | 'milliseconds';

export function timestampToDate(ts: number, unit: TimestampUnit): ToolResult<string> {
  try {
    const ms = unit === 'seconds' ? ts * 1000 : ts;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return { error: 'invalid_timestamp' };
    return { output: date.toISOString() };
  } catch {
    return { error: 'invalid_timestamp' };
  }
}

export function dateToTimestamp(dateStr: string, unit: TimestampUnit): ToolResult<number> {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { error: 'invalid_date' };
    const ms = date.getTime();
    return { output: unit === 'seconds' ? Math.floor(ms / 1000) : ms };
  } catch {
    return { error: 'invalid_date' };
  }
}

export function getCurrentTimestamp(): { seconds: number; milliseconds: number } {
  const now = Date.now();
  return { seconds: Math.floor(now / 1000), milliseconds: now };
}

export function formatDateForTimezone(ts: number, unit: TimestampUnit, timezone: string): ToolResult<string> {
  try {
    const ms = unit === 'seconds' ? ts * 1000 : ts;
    const date = new Date(ms);
    if (isNaN(date.getTime())) return { error: 'invalid_timestamp' };
    const formatted = date.toLocaleString('en-US', { timeZone: timezone, dateStyle: 'full', timeStyle: 'long' });
    return { output: formatted };
  } catch {
    return { error: 'invalid_timezone' };
  }
}
