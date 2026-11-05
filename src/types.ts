export type Note = { pitch: number; start: number; duration: number };
export type Pattern = { id: string; name: string; notes: Note[]; bpm: number };
export type Score = { accuracy: number; combo: number; maxCombo: number };
export type Progress = { patternsCompleted: string[]; bestScores: Record<string, Score> };

export type Timbre = 'sine' | 'square' | 'sawtooth' | 'triangle';

export type Mode = 'home' | 'piano' | 'drums' | 'rhythm' | 'melody' | 'record' | 'progress' | 'settings';
