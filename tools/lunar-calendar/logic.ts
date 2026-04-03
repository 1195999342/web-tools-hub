// Simplified lunar calendar conversion using basic algorithm
const LUNAR_INFO = [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557];

export function solarToLunar(year: number, month: number, day: number): string {
  // Simplified - returns approximate lunar date info
  const date = new Date(year, month - 1, day);
  const base = new Date(1900, 0, 31);
  const diff = Math.floor((date.getTime() - base.getTime()) / 86400000);
  const heavenly = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const earthly = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
  const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
  const idx = (year - 4) % 12;
  const hIdx = (year - 4) % 10;
  const eIdx = (year - 4) % 12;
  const approxMonth = ((month + 10) % 12);
  const approxDay = ((day - 1) % 30);
  return `${heavenly[hIdx]}${earthly[eIdx]}年 (${animals[idx]}) ${lunarMonths[approxMonth]}月${lunarDays[approxDay]}`;
}
