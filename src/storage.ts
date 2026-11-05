import type { Progress, Score } from './types';

const KEY = 'mrl-progress';

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { patternsCompleted: [], bestScores: {} };
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function recordScore(patternId: string, score: Score) {
  const p = loadProgress();
  const prev = p.bestScores[patternId];
  if (!prev || score.accuracy > prev.accuracy) p.bestScores[patternId] = score;
  if (!p.patternsCompleted.includes(patternId) && score.accuracy >= 0.7) {
    p.patternsCompleted.push(patternId);
  }
  saveProgress(p);
}
