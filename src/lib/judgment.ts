export type Judgment = 'Perfect' | 'Good' | 'Miss';

export function judge(diffMs: number): Judgment {
  const a = Math.abs(diffMs);
  if (a <= 50) return 'Perfect';
  if (a <= 120) return 'Good';
  return 'Miss';
}

export function pointsFor(j: Judgment, combo: number): number {
  const base = j === 'Perfect' ? 100 : j === 'Good' ? 50 : 0;
  const mult = 1 + Math.floor(combo / 5) * 0.5;
  return Math.round(base * mult);
}

export function accuracy(hits: number, total: number): number {
  if (total <= 0) return 0;
  return hits / total;
}
