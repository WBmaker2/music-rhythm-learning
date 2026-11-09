import { useEffect, useState } from 'react';
import { playNote } from '../audio/engine';

const OFFSETS: Record<string, number> = {
  a:0, w:1, s:2, e:3, d:4, f:5, t:6, g:7, y:8, h:9, u:10, j:11,
};


export default function Piano() {
  const [base, setBase] = useState(60);
  const [active, setActive] = useState<Set<number>>(new Set());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const off = OFFSETS[e.key.toLowerCase()];
      if (off !== undefined) {
        e.preventDefault();
        const m = base + off;
        if (!active.has(m)) {
          playNote(m);
          setActive(prev => new Set(prev).add(m));
        }
      } else if (e.key === 'ArrowUp') {
        setBase(b => Math.min(72, b + 12));
      } else if (e.key === 'ArrowDown') {
        setBase(b => Math.max(48, b - 12));
      }
    };
    const up = (e: KeyboardEvent) => {
      const off = OFFSETS[e.key.toLowerCase()];
      if (off !== undefined) {
        const m = base + off;
        setActive(prev => {
          const next = new Set(prev);
          next.delete(m);
          return next;
        });
      }
    };
    const blur = () => setActive(new Set());
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [base, active]);

  const KEYS = Array.from({ length: 24 }, (_, i) => 60 + i);
  const BLACK = new Set([1,3,6,8,10]);
  function isBlack(midi: number) { return BLACK.has((midi - 60) % 12); }

  const press = (m: number) => {
    playNote(m);
    setActive(prev => new Set(prev).add(m));
    window.setTimeout(() => {
      setActive(prev => {
        const next = new Set(prev);
        next.delete(m);
        return next;
      });
    }, 180);
  };

  return (
    <div className="piano">
      <div className="octave-controls" style={{ textAlign:'center', marginBottom: 8 }}>
        <button onClick={() => setBase(b => Math.max(48, b-12))}>옥타브 ↓</button>
        <span style={{ margin: '0 12px' }}>기준음: {base}</span>
        <button onClick={() => setBase(b => Math.min(72, b+12))}>옥타브 ↑</button>
      </div>
      <div className="piano-keys">
        {KEYS.map(m => (
          <button
            key={m}
            className={`key ${isBlack(m) ? 'black' : 'white'} ${active.has(m) ? 'active' : ''}`}
            onPointerDown={(e) => { e.preventDefault(); press(m); }}
            aria-label={`MIDI ${m}`}
            aria-pressed={active.has(m)}
          >
            <span className="label">{m}</span>
          </button>
        ))}
      </div>
      <p className="hint">키보드: A W S E D F T G Y H U J (↑/↓ 화살표로 옥타브 이동)</p>
    </div>
  );
}
