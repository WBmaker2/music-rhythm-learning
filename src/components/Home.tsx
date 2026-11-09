import { useEffect, useState } from 'react';
import type { Mode } from '../types';

export default function Home({ go }: { go: (m: Mode) => void }) {
  const cards: { m: Mode; t: string; d: string }[] = [
    { m: 'piano', t: '🎹 피아노', d: '터치 또는 키보드로 연주' },
    { m: 'drums', t: '🥁 드럼', d: '드럼 패드' },
    { m: 'rhythm', t: '🎯 리듬 게임', d: '박자에 맞춰 노트 맞추기' },
    { m: 'melody', t: '🎼 멜로디', d: '재생 및 간이 악보 보기' },
    { m: 'record', t: '⏺ 녹음', d: '녹음 및 재생' },
    { m: 'progress', t: '📊 진행도', d: '점수 및 완료 현황' },
    { m: 'settings', t: '⚙️ 설정', d: 'BPM 및 음색' },
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
      <h1>음악/리듬 학습</h1>
      <p>음정, 박자, 리듬을 소리와 화면으로 연습하세요.</p>
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
