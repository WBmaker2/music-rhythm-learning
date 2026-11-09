import { useEffect, useState } from 'react';
import { playDrum } from '../audio/engine';

const PADS: { k: 'kick'|'snare'|'hihat'; label: string; key: string }[] = [
  { k: 'kick', label: '킥', key: 'z' },
  { k: 'snare', label: '스네어', key: 'x' },
  { k: 'hihat', label: '하이햇', key: 'c' },
  { k: 'kick', label: '킥2', key: 'v' },
  { k: 'snare', label: '스네어2', key: 'b' },
  { k: 'hihat', label: '하이햇2', key: 'n' },
];

export default function Drums() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const pad = PADS.find(p => p.key === e.key.toLowerCase());
      if (pad) {
        e.preventDefault();
        playDrum(pad.k);
        setActive(pad.key);
      }
    };
    const up = () => setActive(null);
    const blur = () => setActive(null);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  return (
    <div className="drums">
      {PADS.map(p => (
        <button
          key={p.key}
          className={`drum-pad ${active === p.key ? 'active' : ''}`}
          onPointerDown={(e) => { e.preventDefault(); playDrum(p.k); setActive(p.key); }}
          onPointerUp={() => setActive(null)}
          aria-label={`${p.label} (${p.key.toUpperCase()})`}
          aria-pressed={active === p.key}
        >
          {p.label} <span style={{ fontSize: 12 }}>({p.key.toUpperCase()})</span>
        </button>
      ))}
      <p className="hint" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>키보드: Z 킥, X 스네어, C 하이햇, V 킥2, B 스네어2, N 하이햇2</p>
    </div>
  );
}
