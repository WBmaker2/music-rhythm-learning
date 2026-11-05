import { useEffect, useRef } from 'react';
import { playNote } from '../audio/engine';

const START = 60;
const COUNT = 24; // 2 octaves
const KEYS = Array.from({ length: COUNT }, (_, i) => START + i);

const BLACK = new Set([1,3,6,8,10]);

function isBlack(midi: number) {
  return BLACK.has((midi - START) % 12);
}

const KEY_MAP: Record<string, number> = {
  a:60, w:61, s:62, e:63, d:64, f:65, t:66, g:67, y:68, h:69, u:70, j:71,
};

export default function Piano() {
  const active = useRef<Set<number>>(new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const m = KEY_MAP[e.key.toLowerCase()];
      if (m !== undefined && !active.current.has(m)) {
        active.current.add(m);
        playNote(m);
      }
    };
    const up = (e: KeyboardEvent) => {
      const m = KEY_MAP[e.key.toLowerCase()];
      if (m !== undefined) active.current.delete(m);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return (
    <div className="piano">
      <div className="piano-keys">
        {KEYS.map(m => (
          <button
            key={m}
            className={`key ${isBlack(m) ? 'black' : 'white'}`}
            onPointerDown={(e) => { e.preventDefault(); playNote(m); }}
            aria-label={`MIDI ${m}`}
          >
            <span className="label">{m}</span>
          </button>
        ))}
      </div>
      <p className="hint">Touch keys or use A W S E D F T G Y H U J (one octave)</p>
    </div>
  );
}
