import { playDrum } from '../audio/engine';

const PADS: { k: 'kick'|'snare'|'hihat'; label: string }[] = [
  { k: 'kick', label: 'Kick' },
  { k: 'snare', label: 'Snare' },
  { k: 'hihat', label: 'Hi-Hat' },
];

export default function Drums() {
  return (
    <div className="drums">
      {PADS.map(p => (
        <button key={p.k} className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum(p.k);}}>
          {p.label}
        </button>
      ))}
      <button className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum('kick');}}>Kick2</button>
      <button className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum('snare');}}>Snare2</button>
      <button className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum('hihat');}}>Hat2</button>
    </div>
  );
}
