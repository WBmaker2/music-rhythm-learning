import type { Pattern, Note } from './types';

const n = (pitch: number, start: number, duration = 0.25): Note => ({ pitch, start, duration });

export const PATTERNS: Pattern[] = [
  { id: 'scale-c', name: 'C Major Scale', bpm: 90, notes: [60,62,64,65,67,69,71,72].map((p,i)=>n(p,i*0.5,0.4)) },
  { id: 'twinkle', name: 'Twinkle (simplified)', bpm: 100, notes: [
      n(60,0),n(60,0.5),n(67,1),n(67,1.5),n(69,2),n(69,2.5),n(67,3,0.5),
      n(65,4),n(65,4.5),n(64,5),n(64,5.5),n(62,6),n(62,6.5),n(60,7,0.5),
  ] },
  { id: 'rhythm-1', name: 'Basic Rhythm', bpm: 100, notes: [
      n(60,0), n(60,0.5), n(60,1), n(62,1.5), n(60,2), n(64,2.5), n(60,3), n(65,3.5),
  ] },
  { id: 'chords', name: 'C-G-Am-F', bpm: 80, notes: [
      n(60,0,0.8),n(64,0,0.8),n(67,0,0.8),
      n(67,1,0.8),n(71,1,0.8),n(74,1,0.8),
      n(69,2,0.8),n(72,2,0.8),n(76,2,0.8),
      n(65,3,0.8),n(69,3,0.8),n(72,3,0.8),
  ] },
];

export const DRUM_PATTERNS: Pattern[] = [
  { id: 'drum-basic', name: 'Basic Beat', bpm: 100, notes: [
      { pitch: 36, start: 0, duration: 0.1 }, { pitch: 42, start: 0.5, duration: 0.1 },
      { pitch: 38, start: 1, duration: 0.1 }, { pitch: 42, start: 1.5, duration: 0.1 },
      { pitch: 36, start: 2, duration: 0.1 }, { pitch: 42, start: 2.5, duration: 0.1 },
      { pitch: 38, start: 3, duration: 0.1 }, { pitch: 42, start: 3.5, duration: 0.1 },
  ] },
];
