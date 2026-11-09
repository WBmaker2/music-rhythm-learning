import { useEffect, useRef, useState } from 'react';
import { PATTERNS } from '../patterns';
import { playNote, playMiss, startMetronome, stopMetronome } from '../audio/engine';
import { recordScore } from '../storage';
import { judge, pointsFor } from '../lib/judgment';

const HIT_WINDOW = 120;
const FALL_MS = 1800;
const LANE_KEYS = ['a','s','d','f','g','h','j','k','l',';'];

export default function RhythmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [patternId, setPatternId] = useState(PATTERNS[0].id);
  const pattern = PATTERNS.find(p => p.id === patternId)!;
  const [playing, setPlaying] = useState(false);
  const [stats, setStats] = useState<{ hits: number; total: number; combo: number; maxCombo: number; score: number; finished: boolean; lastJudgment: string }>({ hits: 0, total: 0, combo: 0, maxCombo: 0, score: 0, finished: false, lastJudgment: '' });

  const gameRef = useRef<any>(null);

  const start = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const uniquePitches = [...new Set(pattern.notes.map(n => n.pitch))].sort((a,b)=>a-b);
    const laneOf = (pitch: number) => uniquePitches.indexOf(pitch);
    const lanes = uniquePitches.length;
    const beatMs = 60000 / pattern.bpm;
    const startOffset = 1000;
    const noteTimes = pattern.notes.map((note) => ({
      note, hitTime: startOffset + note.start * beatMs, hit: false, missed: false, judgment: '',
    }));
    const startTime = performance.now();
    let combo = 0, maxCombo = 0, hits = 0, score = 0;
    const total = noteTimes.length;

    startMetronome(pattern.bpm);

    const laneKeyMap: Record<string, number> = {};
    uniquePitches.forEach((p, i) => { if (i < LANE_KEYS.length) laneKeyMap[LANE_KEYS[i]] = p; });

    const onKey = (e: KeyboardEvent) => {
      const pitch = laneKeyMap[e.key.toLowerCase()];
      if (pitch === undefined) return;
      const now = performance.now() - startTime;
      let best: any = null; let bestDiff = HIT_WINDOW;
      for (const nt of noteTimes) {
        if (nt.hit || nt.missed) continue;
        if (nt.note.pitch !== pitch) continue;
        const diff = Math.abs(nt.hitTime - now);
        if (diff < bestDiff) { bestDiff = diff; best = nt; }
      }
      if (best) {
        best.hit = true;
        const j = judge(bestDiff);
        best.judgment = j;
        if (j === 'Miss') return;
        hits++;
        const pts = pointsFor(j, combo);
        score += pts;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        playNote(pitch, undefined, 0.2);
        setStats(s => ({ ...s, hits, combo, maxCombo, score, lastJudgment: j }));
      }
    };
    window.addEventListener('keydown', onKey);

    let raf = 0;
    const loop = () => {
      const now = performance.now() - startTime;
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      const laneW = w / lanes;
      for (let i=0;i<lanes;i++){
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(i*laneW,0); ctx.lineTo(i*laneW,h); ctx.stroke();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText(LANE_KEYS[i] ?? '', i*laneW + laneW/2 - 4, h-8);
      }
      const hitLineY = h - 40;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0,hitLineY); ctx.lineTo(w,hitLineY); ctx.stroke();
      ctx.lineWidth = 1;

      for (const nt of noteTimes) {
        if (nt.missed) continue;
        if (nt.hit) continue;
        const tUntil = nt.hitTime - now;
        if (tUntil < -HIT_WINDOW) {
          nt.missed = true;
          nt.judgment = 'Miss';
          combo = 0;
          playMiss();
          setStats(s => ({ ...s, combo: 0, lastJudgment: 'Miss' }));
          continue;
        }
        if (tUntil > FALL_MS) continue;
        const y = hitLineY * (1 - tUntil / FALL_MS);
        const lane = laneOf(nt.note.pitch);
        const x = lane * laneW + laneW * 0.15;
        const nw = laneW * 0.7;
        ctx.fillStyle = nt.note.pitch % 2 === 0 ? '#38bdf8' : '#f472b6';
        ctx.fillRect(x, y-12, nw, 24);
      }

      const allDone = noteTimes.every(n => n.hit || n.missed);
      const lastTime = Math.max(...noteTimes.map(n=>n.hitTime));
      if (allDone && now > lastTime + 500) {
        stopMetronome();
        window.removeEventListener('keydown', onKey);
        const accuracyVal = total > 0 ? hits / total : 0;
        setStats({ hits, total, combo: 0, maxCombo, score, finished: true, lastJudgment: '' });
        recordScore(pattern.id, { accuracy: accuracyVal, combo: hits, maxCombo });
        setPlaying(false);
        cancelAnimationFrame(raf);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    gameRef.current = { raf, onKey };
    setPlaying(true);
    setStats({ hits: 0, total, combo: 0, maxCombo: 0, score: 0, finished: false, lastJudgment: '' });
  };

  const stop = () => {
    stopMetronome();
    if (gameRef.current) {
      cancelAnimationFrame(gameRef.current.raf);
      window.removeEventListener('keydown', gameRef.current.onKey);
    }
    setPlaying(false);
  };

  useEffect(() => () => stop(), []);

  const accuracyPct = stats.total > 0 ? Math.round((stats.hits / stats.total) * 100) : 0;

  return (
    <div className="rhythm">
      <div className="rhythm-controls">
        <select value={patternId} onChange={e => setPatternId(e.target.value)} disabled={playing}>
          {PATTERNS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.bpm} BPM)</option>)}
        </select>
        {!playing ? <button onClick={start} className="btn-pulse">Start</button> : <button onClick={stop}>Stop</button>}
      </div>
      <canvas ref={canvasRef} width={480} height={400} aria-label="리듬 게임 캔버스" role="img" />
      <div className="score" aria-live="polite">
        맞춘 수: {stats.hits}/{stats.total} | 콤보: {stats.combo} | 최대: {stats.maxCombo} | 점수: {stats.score}
        {stats.lastJudgment && <span> — {stats.lastJudgment === "Perfect" ? "퍼펙트" : stats.lastJudgment === "Good" ? "굿" : "미스"}</span>}
      </div>
      {stats.finished && (
        <div className="result-overlay">
          <div className="result-card">
            <h3>결과</h3>
            <p>정확도: {accuracyPct}%</p>
            <p>최대 콤보: {stats.maxCombo}</p>
            <p>점수: {stats.score}</p>
            <div className="rhythm-controls">
              <button onClick={start}>다시 시도</button>
              <button onClick={() => setStats(s => ({ ...s, finished: false }))}>닫기</button>
            </div>
          </div>
        </div>
      )}
      <p className="hint">레인 조작 키: A S D F G H J K L ;</p>
    </div>
  );
}
