const PI = Math.PI, a = 6378245.0, ee = 0.00669342162296594323;
function outOfChina(lng: number, lat: number) { return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271; }
function transformLat(x: number, y: number) { let r = -100 + 2*x + 3*y + 0.2*y*y + 0.1*x*y + 0.2*Math.sqrt(Math.abs(x)); r += (20*Math.sin(6*x*PI)+20*Math.sin(2*x*PI))*2/3; r += (20*Math.sin(y*PI)+40*Math.sin(y/3*PI))*2/3; r += (160*Math.sin(y/12*PI)+320*Math.sin(y*PI/30))*2/3; return r; }
function transformLng(x: number, y: number) { let r = 300 + x + 2*y + 0.1*x*x + 0.1*x*y + 0.1*Math.sqrt(Math.abs(x)); r += (20*Math.sin(6*x*PI)+20*Math.sin(2*x*PI))*2/3; r += (20*Math.sin(x*PI)+40*Math.sin(x/3*PI))*2/3; r += (150*Math.sin(x/12*PI)+300*Math.sin(x/30*PI))*2/3; return r; }

export function wgs84ToGcj02(lng: number, lat: number): [number, number] {
  if (outOfChina(lng, lat)) return [lng, lat];
  let dLat = transformLat(lng - 105, lat - 35), dLng = transformLng(lng - 105, lat - 35);
  const radLat = lat / 180 * PI, magic = Math.sin(radLat);
  const sqrtMagic = Math.sqrt(1 - ee * magic * magic);
  dLat = (dLat * 180) / ((a * (1 - ee)) / (sqrtMagic * sqrtMagic * sqrtMagic) * PI);
  dLng = (dLng * 180) / (a / sqrtMagic * Math.cos(radLat) * PI);
  return [lng + dLng, lat + dLat];
}

export function gcj02ToBd09(lng: number, lat: number): [number, number] {
  const z = Math.sqrt(lng*lng + lat*lat) + 0.00002 * Math.sin(lat * PI * 3000 / 180);
  const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * PI * 3000 / 180);
  return [z * Math.cos(theta) + 0.0065, z * Math.sin(theta) + 0.006];
}

export function bd09ToGcj02(lng: number, lat: number): [number, number] {
  const x = lng - 0.0065, y = lat - 0.006;
  const z = Math.sqrt(x*x + y*y) - 0.00002 * Math.sin(y * PI * 3000 / 180);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * PI * 3000 / 180);
  return [z * Math.cos(theta), z * Math.sin(theta)];
}
