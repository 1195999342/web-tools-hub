const WORDS = ['hello', 'world', 'foo', 'bar', 'test', 'data', 'name', 'value', 'item', 'key'];

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randWord() { return WORDS[randInt(0, WORDS.length - 1)]; }

export function generateRandomJSON(depth: number, fields: number): unknown {
  if (depth <= 0) {
    const t = randInt(0, 3);
    if (t === 0) return randInt(-100, 100);
    if (t === 1) return randWord();
    if (t === 2) return Math.random() > 0.5;
    return null;
  }
  if (Math.random() > 0.7) {
    return Array.from({ length: randInt(1, fields) }, () => generateRandomJSON(depth - 1, fields));
  }
  const obj: Record<string, unknown> = {};
  const n = randInt(1, fields);
  for (let i = 0; i < n; i++) {
    obj[randWord() + '_' + i] = generateRandomJSON(depth - 1, fields);
  }
  return obj;
}
