export type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'too-early';

export function getRandomDelay(): number {
  return 2000 + Math.random() * 3000; // 2-5 seconds
}

export function getReactionRating(ms: number): string {
  if (ms < 200) return 'Incredible! 🏆';
  if (ms < 250) return 'Excellent! 🥇';
  if (ms < 300) return 'Great! 🥈';
  if (ms < 400) return 'Good 🥉';
  if (ms < 500) return 'Average 👍';
  return 'Keep practicing! 💪';
}
