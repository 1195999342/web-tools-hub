// Shichen Converter logic
export const TOOL_NAME = 'shichen';

const SHICHEN = [
  { name: '子时 (Zi)', range: '23:00 - 00:59', branch: '子' },
  { name: '丑时 (Chou)', range: '01:00 - 02:59', branch: '丑' },
  { name: '寅时 (Yin)', range: '03:00 - 04:59', branch: '寅' },
  { name: '卯时 (Mao)', range: '05:00 - 06:59', branch: '卯' },
  { name: '辰时 (Chen)', range: '07:00 - 08:59', branch: '辰' },
  { name: '巳时 (Si)', range: '09:00 - 10:59', branch: '巳' },
  { name: '午时 (Wu)', range: '11:00 - 12:59', branch: '午' },
  { name: '未时 (Wei)', range: '13:00 - 14:59', branch: '未' },
  { name: '申时 (Shen)', range: '15:00 - 16:59', branch: '申' },
  { name: '酉时 (You)', range: '17:00 - 18:59', branch: '酉' },
  { name: '戌时 (Xu)', range: '19:00 - 20:59', branch: '戌' },
  { name: '亥时 (Hai)', range: '21:00 - 22:59', branch: '亥' },
];

export interface ShichenResult {
  name: string;
  range: string;
  branch: string;
}

export function getShichen(hour: number): ShichenResult {
  if (hour === 23 || hour === 0) return SHICHEN[0];
  const idx = Math.floor((hour + 1) / 2);
  return SHICHEN[idx];
}

export function getAllShichen() { return SHICHEN; }
