export interface PhotoSize {
  name: string;
  widthMm: number;
  heightMm: number;
  widthPx300: number;
  heightPx300: number;
  usage: string;
}

export const PHOTO_SIZES: PhotoSize[] = [
  { name: '1-inch', widthMm: 25, heightMm: 35, widthPx300: 295, heightPx300: 413, usage: 'Student ID, work badge' },
  { name: 'Small 1-inch', widthMm: 22, heightMm: 32, widthPx300: 260, heightPx300: 378, usage: 'ID card, driver license' },
  { name: '2-inch', widthMm: 35, heightMm: 49, widthPx300: 413, heightPx300: 579, usage: 'Passport (CN), diploma' },
  { name: 'Small 2-inch', widthMm: 35, heightMm: 45, widthPx300: 413, heightPx300: 531, usage: 'Passport (CN), visa' },
  { name: 'US Passport', widthMm: 51, heightMm: 51, widthPx300: 600, heightPx300: 600, usage: 'US passport, visa' },
  { name: 'UK Passport', widthMm: 35, heightMm: 45, widthPx300: 413, heightPx300: 531, usage: 'UK passport' },
  { name: 'EU/Schengen Visa', widthMm: 35, heightMm: 45, widthPx300: 413, heightPx300: 531, usage: 'Schengen visa application' },
  { name: 'Japan Visa', widthMm: 45, heightMm: 45, widthPx300: 531, heightPx300: 531, usage: 'Japan visa' },
  { name: 'India Passport', widthMm: 35, heightMm: 35, widthPx300: 413, heightPx300: 413, usage: 'India passport' },
  { name: 'Canada PR', widthMm: 50, heightMm: 70, widthPx300: 591, heightPx300: 827, usage: 'Canada permanent residence' },
  { name: 'Australia Visa', widthMm: 35, heightMm: 45, widthPx300: 413, heightPx300: 531, usage: 'Australia visa' },
  { name: '3-inch', widthMm: 55, heightMm: 84, widthPx300: 649, heightPx300: 991, usage: 'General photo print' },
  { name: '5-inch', widthMm: 89, heightMm: 127, widthPx300: 1050, heightPx300: 1499, usage: 'Standard photo print' },
];
