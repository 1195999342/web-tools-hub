const MORSE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
  '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

const REVERSE: Record<string, string> = {};
for (const [k, v] of Object.entries(MORSE)) REVERSE[v] = k;

export function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => {
    if (c === ' ') return '/';
    return MORSE[c] || '';
  }).filter(Boolean).join(' ');
}

export function morseToText(morse: string): string {
  return morse.split(' / ').map(word =>
    word.split(' ').map(code => REVERSE[code] || '').join('')
  ).join(' ');
}
