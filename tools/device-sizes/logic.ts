export interface DeviceInfo {
  name: string;
  brand: string;
  screenSize: string;
  resolution: string;
  ppi: number;
  category: 'iphone' | 'ipad' | 'android';
}

export const DEVICES: DeviceInfo[] = [
  { name: 'iPhone 15 Pro Max', brand: 'Apple', screenSize: '6.7"', resolution: '2796×1290', ppi: 460, category: 'iphone' },
  { name: 'iPhone 15 Pro', brand: 'Apple', screenSize: '6.1"', resolution: '2556×1179', ppi: 460, category: 'iphone' },
  { name: 'iPhone 15', brand: 'Apple', screenSize: '6.1"', resolution: '2556×1179', ppi: 460, category: 'iphone' },
  { name: 'iPhone 15 Plus', brand: 'Apple', screenSize: '6.7"', resolution: '2796×1290', ppi: 460, category: 'iphone' },
  { name: 'iPhone 14 Pro Max', brand: 'Apple', screenSize: '6.7"', resolution: '2796×1290', ppi: 460, category: 'iphone' },
  { name: 'iPhone 14 Pro', brand: 'Apple', screenSize: '6.1"', resolution: '2556×1179', ppi: 460, category: 'iphone' },
  { name: 'iPhone 14', brand: 'Apple', screenSize: '6.1"', resolution: '2532×1170', ppi: 460, category: 'iphone' },
  { name: 'iPhone 13', brand: 'Apple', screenSize: '6.1"', resolution: '2532×1170', ppi: 460, category: 'iphone' },
  { name: 'iPhone SE (3rd)', brand: 'Apple', screenSize: '4.7"', resolution: '1334×750', ppi: 326, category: 'iphone' },
  { name: 'iPhone 12', brand: 'Apple', screenSize: '6.1"', resolution: '2532×1170', ppi: 460, category: 'iphone' },
  { name: 'iPhone 11', brand: 'Apple', screenSize: '6.1"', resolution: '1792×828', ppi: 326, category: 'iphone' },
  { name: 'iPad Pro 12.9"', brand: 'Apple', screenSize: '12.9"', resolution: '2732×2048', ppi: 264, category: 'ipad' },
  { name: 'iPad Pro 11"', brand: 'Apple', screenSize: '11"', resolution: '2388×1668', ppi: 264, category: 'ipad' },
  { name: 'iPad Air (5th)', brand: 'Apple', screenSize: '10.9"', resolution: '2360×1640', ppi: 264, category: 'ipad' },
  { name: 'iPad (10th)', brand: 'Apple', screenSize: '10.9"', resolution: '2360×1640', ppi: 264, category: 'ipad' },
  { name: 'iPad mini (6th)', brand: 'Apple', screenSize: '8.3"', resolution: '2266×1488', ppi: 326, category: 'ipad' },
  { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', screenSize: '6.8"', resolution: '3120×1440', ppi: 505, category: 'android' },
  { name: 'Samsung Galaxy S24+', brand: 'Samsung', screenSize: '6.7"', resolution: '3120×1440', ppi: 513, category: 'android' },
  { name: 'Samsung Galaxy S24', brand: 'Samsung', screenSize: '6.2"', resolution: '2340×1080', ppi: 416, category: 'android' },
  { name: 'Samsung Galaxy S23', brand: 'Samsung', screenSize: '6.1"', resolution: '2340×1080', ppi: 425, category: 'android' },
  { name: 'Samsung Galaxy A54', brand: 'Samsung', screenSize: '6.4"', resolution: '2340×1080', ppi: 403, category: 'android' },
  { name: 'Google Pixel 8 Pro', brand: 'Google', screenSize: '6.7"', resolution: '2992×1344', ppi: 489, category: 'android' },
  { name: 'Google Pixel 8', brand: 'Google', screenSize: '6.2"', resolution: '2400×1080', ppi: 428, category: 'android' },
  { name: 'Google Pixel 7a', brand: 'Google', screenSize: '6.1"', resolution: '2400×1080', ppi: 429, category: 'android' },
  { name: 'OnePlus 12', brand: 'OnePlus', screenSize: '6.82"', resolution: '3168×1440', ppi: 510, category: 'android' },
  { name: 'Xiaomi 14 Pro', brand: 'Xiaomi', screenSize: '6.73"', resolution: '3200×1440', ppi: 522, category: 'android' },
];

export function filterDevices(devices: DeviceInfo[], search: string, category: string): DeviceInfo[] {
  let filtered = devices;
  if (category !== 'all') filtered = filtered.filter(d => d.category === category);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(d => d.name.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q));
  }
  return filtered;
}
