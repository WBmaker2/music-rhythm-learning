import { useEffect, useState } from 'react';
import type { Mode } from '../types';

export default function Home({ go }: { go: (m: Mode) => void }) {
  const cards: { m: Mode; t: string; d: string }[] = [
    { m: 'piano', t: '🎹 Piano', d: 'Play notes with touch or keyboard' },
    { m: 'drums', t: '🥁 Drums', d: 'Drum pads' },
    { m: 'rhythm', t: '🎯 Rhythm Game', d: 'Hit notes in time' },
    { m: 'melody', t: '🎼 Melody', d: 'Play and view simple sheet' },
    { m: 'record', t: '⏺ Record', d: 'Record and playback' },
    { m: 'progress', t: '📊 Progress', d: 'Scores and completion' },
    { m: 'settings', t: '⚙️ Settings', d: 'BPM and timbre' },
  ];
  const [showLog, setShowLog] = useState(false);
  const [log, setLog] = useState('');
  useEffect(() => {
    if (showLog && !log) {
      fetch('/UPDATELOG.md').then(r => r.text()).then(setLog).catch(() => setLog('No log'));
    }
  }, [showLog, log]);
  return (
    <div className="home">
      <h1>Music Rhythm Learning</h1>
      <p>Practice pitch, timing, and rhythm with sound and visuals.</p>
      <div className="grid">
        {cards.map(c => (
          <button key={c.m} className="card" onClick={() => go(c.m)}>
            <div className="card-title">{c.t}</div>
            <div className="card-desc">{c.d}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowLog(true)}>업데이트 내역</button>
      </div>
      {showLog && (
        <div className="modal-backdrop" onClick={() => setShowLog(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>업데이트 내역</h2>
            <pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left', maxHeight: '60vh', overflow: 'auto' }}>{log}</pre>
            <button onClick={() => setShowLog(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
