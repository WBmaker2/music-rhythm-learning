import { playDrum } from '../audio/engine';

const PADS: { k: 'kick'|'snare'|'hihat'; label: string }[] = [
  { k: 'kick', label: '킥' },
  { k: 'snare', label: '스네어' },
  { k: 'hihat', label: '하이햇' },
];

export default function Drums() {
  return (
    <div className="drums">
      {PADS.map(p => (
        <button key={p.k} className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum(p.k);}}>
          {p.label}
        </button>
      ))}
      <button className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum('kick');}}>킥2</button>
      <button className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum('snare');}}>스네어2</button>
      <button className="drum-pad" onPointerDown={(e)=>{e.preventDefault(); playDrum('hihat');}}>하이햇2</button>
    </div>
  );
}
