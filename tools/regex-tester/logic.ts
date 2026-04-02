export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexResult {
  matches: RegexMatch[];
  error?: string;
}

export function testRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) return { matches: [] };
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    if (flags.includes('g')) {
      let m: RegExpExecArray | null;
      while ((m = regex.exec(text)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
        if (!m[0]) regex.lastIndex++; // prevent infinite loop on zero-length match
      }
    } else {
      const m = regex.exec(text);
      if (m) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }
    }
    return { matches };
  } catch (e) {
    return { matches: [], error: (e as Error).message };
  }
}
