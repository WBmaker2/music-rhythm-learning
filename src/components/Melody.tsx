import { useEffect, useRef, useState } from 'react';
import { PATTERNS } from '../patterns';
import { playNote, getCtx } from '../audio/engine';

export default function Melody() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [patternId, setPatternId] = useState(PATTERNS[0].id);
  const pattern = PATTERNS.find(p => p.id === patternId)!;
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number>(0);

  const draw = (progressMs: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    // staff lines
    const top = 40, bottom = h-40;
    for (let i = 0; i < 5; i++) {
      const y = top + (bottom-top) * i / 4;
      ctx.strokeStyle = '#475569';
      ctx.beginPath(); ctx.moveTo(20,y); ctx.lineTo(w-20,y); ctx.stroke();
    }
    const beatMs = 60000 / pattern.bpm;
    const totalMs = Math.max(...pattern.notes.map(n => (n.start + n.duration) * beatMs)) + beatMs;
    const minPitch = Math.min(...pattern.notes.map(n=>n.pitch));
    const maxPitch = Math.max(...pattern.notes.map(n=>n.pitch));
    const range = Math.max(1, maxPitch - minPitch);
    pattern.notes.forEach(n => {
      const x = 20 + (n.start * beatMs / totalMs) * (w-40);
      const y = bottom - ((n.pitch - minPitch) / range) * (bottom-top);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.ellipse(x, y, 8, 5, 0, 0, Math.PI*2); ctx.fill();
    });
    // cursor
    const cx = 20 + (progressMs / totalMs) * (w-40);
    if (progressMs >= 0 && progressMs <= totalMs) {
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, h-20); ctx.stroke();
      ctx.lineWidth = 1;
    }
  };

  const play = () => {
    const c = getCtx();
    const beatSec = 60 / pattern.bpm;
    const t0 = c.currentTime + 0.5;
    pattern.notes.forEach(n => {
      playNote(n.pitch, t0 + n.start * beatSec, Math.max(0.15, n.duration * beatSec));
    });
    const totalMs = Math.max(...pattern.notes.map(n => (n.start + n.duration) * (60000/pattern.bpm))) + 60000/pattern.bpm;
    const audioStartPerf = performance.now() + 500;
    setPlaying(true);
    const loop = () => {
      const elapsed = performance.now() - audioStartPerf;
      draw(elapsed);
      if (elapsed < totalMs) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        setPlaying(false);
        draw(totalMs);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    setPlaying(false);
    draw(0);
  };

  useEffect(() => { draw(0); return () => cancelAnimationFrame(rafRef.current); 
  }, [patternId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="melody">
      <div className="rhythm-controls">
        <select value={patternId} onChange={e => setPatternId(e.target.value)} disabled={playing}>
          {PATTERNS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.bpm} BPM)</option>)}
        </select>
        {!playing ? <button onClick={play} className="btn-pulse">재생</button> : <button onClick={stop}>정지</button>}
      </div>
      <canvas ref={canvasRef} width={640} height={200} aria-label="Melody sheet" role="img" />
      <p className="hint">음표는 음높이(세로)와 시간(가로)에 따라 배치됩니다.</p>
    </div>
  );
}
