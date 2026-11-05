import { useEffect, useState } from 'react';
import { setTimbre, setVolume } from '../audio/engine';
import type { Timbre } from '../types';

const KEY = 'mrl-settings';

export default function Settings() {
  const [timbre, setT] = useState<Timbre>(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s.timbre) return s.timbre; } } catch {} return 'sine';
  });
  const [volume, setV] = useState<number>(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (typeof s.volume === 'number') return s.volume; } } catch {} return 0.5;
  });
  const [bpm, setBpm] = useState<number>(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) { const s = JSON.parse(raw); if (s.bpm) return s.bpm; } } catch {} return 100;
  });

  useEffect(() => { setTimbre(timbre); setVolume(volume); }, [timbre, volume]);

  const save = (next: any) => {
    const s = { timbre, volume, bpm, ...next };
    localStorage.setItem(KEY, JSON.stringify(s));
  };

  return (
    <div className="settings">
      <label>Timbre
        <select value={timbre} onChange={e => { const v = e.target.value as Timbre; setT(v); setTimbre(v); save({ timbre: v }); }}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </label>
      <label>Volume
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => { const v = Number(e.target.value); setV(v); setVolume(v); save({ volume: v }); }} />
      </label>
      <label>BPM (metronome default)
        <input type="number" min={40} max={240} value={bpm} onChange={e => { const v = Number(e.target.value); setBpm(v); save({ bpm: v }); }} />
      </label>
    </div>
  );
}
