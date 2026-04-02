export interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export function parseCron(expr: string): CronParts | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  return { minute: parts[0], hour: parts[1], dayOfMonth: parts[2], month: parts[3], dayOfWeek: parts[4] };
}

export function buildCron(parts: CronParts): string {
  return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

const MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function describeField(value: string, unit: string, names?: string[]): string {
  if (value === '*') return `every ${unit}`;
  if (value.includes('/')) {
    const [, step] = value.split('/');
    return `every ${step} ${unit}(s)`;
  }
  if (value.includes(',')) {
    const parts = value.split(',').map(v => names ? (names[parseInt(v)] || v) : v);
    return `at ${unit} ${parts.join(', ')}`;
  }
  if (value.includes('-')) {
    const [from, to] = value.split('-').map(v => names ? (names[parseInt(v)] || v) : v);
    return `${unit} ${from} through ${to}`;
  }
  const display = names ? (names[parseInt(value)] || value) : value;
  return `at ${unit} ${display}`;
}

export function describeCron(expr: string): string {
  const parts = parseCron(expr);
  if (!parts) return 'Invalid cron expression';
  const descs: string[] = [];
  descs.push(describeField(parts.minute, 'minute'));
  descs.push(describeField(parts.hour, 'hour'));
  descs.push(describeField(parts.dayOfMonth, 'day'));
  descs.push(describeField(parts.month, 'month', MONTHS));
  descs.push(describeField(parts.dayOfWeek, 'weekday', DAYS));
  return descs.join(', ');
}

export function getNextRuns(expr: string, count: number = 5): string[] {
  const parts = parseCron(expr);
  if (!parts) return [];
  const results: string[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  for (let i = 0; i < 525600 && results.length < count; i++) {
    if (matchField(parts.month, d.getMonth() + 1) &&
        matchField(parts.dayOfMonth, d.getDate()) &&
        matchField(parts.dayOfWeek, d.getDay()) &&
        matchField(parts.hour, d.getHours()) &&
        matchField(parts.minute, d.getMinutes())) {
      results.push(d.toISOString().replace('T', ' ').substring(0, 16));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

function matchField(pattern: string, value: number): boolean {
  if (pattern === '*') return true;
  if (pattern.includes('/')) {
    const [base, step] = pattern.split('/');
    const s = parseInt(step);
    const b = base === '*' ? 0 : parseInt(base);
    return (value - b) % s === 0 && value >= b;
  }
  if (pattern.includes(',')) return pattern.split(',').some(v => parseInt(v) === value);
  if (pattern.includes('-')) {
    const [from, to] = pattern.split('-').map(Number);
    return value >= from && value <= to;
  }
  return parseInt(pattern) === value;
}
