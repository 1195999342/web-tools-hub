// Chinese Zodiac logic
export const TOOL_NAME = 'zodiac';

const ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
const HEAVENLY_STEMS = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
const EARTHLY_BRANCHES = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
const ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];

export interface ZodiacResult {
  animal: string;
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
}

export function getZodiac(year: number): ZodiacResult {
  const idx = ((year - 4) % 12 + 12) % 12;
  const stemIdx = ((year - 4) % 10 + 10) % 10;
  return {
    animal: ANIMALS[idx],
    heavenlyStem: HEAVENLY_STEMS[stemIdx],
    earthlyBranch: EARTHLY_BRANCHES[idx],
    element: ELEMENTS[stemIdx],
  };
}
