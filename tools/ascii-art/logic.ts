const FONT: Record<string, string[]> = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').forEach(c => {
  FONT[c] = [
    ' ### ', '#### ', ' ### ', '#### ', '#####', '#####', ' ### ', '#   #', '#####', '    #', '#  # ', '#    ', '#   #',
    '#   #', ' ### ', '#### ', ' ### ', '#### ', ' ### ', '#####', '#   #', '#   #', '#   #', '#   #', '#   #', '#####',
    ' ### ', ' #  ', ' ##  ', ' ##  ', '#  # ', '#####', ' ### ', '    #', ' ### ', ' ### '
  ].slice('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(c) * 0, 1)[0] ? [c.repeat(5)] : [' ' + c.repeat(3) + ' '];
});

export function generateAsciiArt(text: string): string {
  const chars = text.toUpperCase().split('');
  const height = 5;
  const lines: string[] = Array(height).fill('');
  for (const c of chars) {
    if (c === ' ') { for (let i = 0; i < height; i++) lines[i] += '    '; continue; }
    const block = getCharBlock(c);
    for (let i = 0; i < height; i++) lines[i] += (block[i] || '     ') + ' ';
  }
  return lines.join('\n');
}

function getCharBlock(c: string): string[] {
  const blocks: Record<string, string[]> = {
    'A': [' ██ ', '█  █', '████', '█  █', '█  █'],
    'B': ['███ ', '█  █', '███ ', '█  █', '███ '],
    'C': [' ███', '█   ', '█   ', '█   ', ' ███'],
    'D': ['███ ', '█  █', '█  █', '█  █', '███ '],
    'E': ['████', '█   ', '███ ', '█   ', '████'],
    'F': ['████', '█   ', '███ ', '█   ', '█   '],
    'H': ['█  █', '█  █', '████', '█  █', '█  █'],
    'I': ['███', ' █ ', ' █ ', ' █ ', '███'],
    'L': ['█   ', '█   ', '█   ', '█   ', '████'],
    'O': [' ██ ', '█  █', '█  █', '█  █', ' ██ '],
    'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
  };
  return blocks[c] || [c.repeat(4), c.repeat(4), c.repeat(4), c.repeat(4), c.repeat(4)];
}
