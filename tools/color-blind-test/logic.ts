export interface IshiharaPlate {
  id: number;
  answer: number;
  bgDots: { cx: number; cy: number; r: number; fill: string }[];
  fgDots: { cx: number; cy: number; r: number; fill: string }[];
}

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function generatePlate(id: number, digit: number): IshiharaPlate {
  const rand = seededRandom(id * 1000 + digit);
  const bgColors = ['#8B9E6B', '#9AAF7C', '#7B8E5B', '#A4B88C', '#6B7E4B'];
  const fgColors = ['#C45C4A', '#D4705E', '#B44838', '#E08472', '#A43828'];

  // Define digit patterns on a 10x14 grid
  const digitPatterns: Record<number, number[][]> = {
    3: [[0,1,1,1],[1,0,0,1],[0,0,1,1],[0,0,0,1],[1,0,0,1],[0,1,1,0]],
    5: [[1,1,1,1],[1,0,0,0],[1,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]],
    7: [[1,1,1,1],[0,0,0,1],[0,0,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    8: [[0,1,1,0],[1,0,0,1],[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
    12:[[1,0,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,0,1,1,0],[1,0,1,0,0],[1,0,1,1,0]],
    6: [[0,1,1,0],[1,0,0,0],[1,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,0]],
    2: [[0,1,1,0],[1,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0],[1,1,1,1]],
    9: [[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,1],[0,0,0,1],[0,1,1,0]],
  };

  const pattern = digitPatterns[digit] || digitPatterns[8];
  const rows = pattern.length;
  const cols = pattern[0].length;

  const bgDots: IshiharaPlate['bgDots'] = [];
  const fgDots: IshiharaPlate['fgDots'] = [];
  const size = 200;

  for (let i = 0; i < 300; i++) {
    const cx = rand() * size;
    const cy = rand() * size;
    const r = 3 + rand() * 5;

    // Check if dot is in the digit area
    const gridX = Math.floor((cx / size) * cols);
    const gridY = Math.floor((cy / size) * rows);
    const inDigit = gridY >= 0 && gridY < rows && gridX >= 0 && gridX < cols && pattern[gridY][gridX] === 1;

    if (inDigit) {
      fgDots.push({ cx, cy, r, fill: fgColors[Math.floor(rand() * fgColors.length)] });
    } else {
      bgDots.push({ cx, cy, r, fill: bgColors[Math.floor(rand() * bgColors.length)] });
    }
  }

  return { id, answer: digit, bgDots, fgDots };
}

export const PLATES: IshiharaPlate[] = [
  generatePlate(1, 8),
  generatePlate(2, 3),
  generatePlate(3, 5),
  generatePlate(4, 6),
  generatePlate(5, 9),
  generatePlate(6, 7),
];
