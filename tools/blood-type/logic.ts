// Blood Type logic
export const TOOL_NAME = 'blood-type';

type BloodType = 'A' | 'B' | 'AB' | 'O';

const GENETICS: Record<BloodType, string[][]> = {
  A: [['A', 'A'], ['A', 'O']],
  B: [['B', 'B'], ['B', 'O']],
  AB: [['A', 'B']],
  O: [['O', 'O']],
};

function allelesToType(a: string, b: string): BloodType {
  const s = new Set([a, b]);
  if (s.has('A') && s.has('B')) return 'AB';
  if (s.has('A')) return 'A';
  if (s.has('B')) return 'B';
  return 'O';
}

export function getPossibleChildTypes(father: BloodType, mother: BloodType): BloodType[] {
  const results = new Set<BloodType>();
  for (const fg of GENETICS[father]) {
    for (const mg of GENETICS[mother]) {
      for (const fa of fg) {
        for (const ma of mg) {
          results.add(allelesToType(fa, ma));
        }
      }
    }
  }
  return Array.from(results).sort();
}
