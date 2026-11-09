import { useState } from 'react';
import type { Mode } from '../types';

type Entry = { date: string; items: string[] };

function parseLog(text: string): Entry[] {
  const entries: Entry[] = [];
  let current: Entry | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('## ')) {
      current = { date: line.replace(/^##\s*/, ''), items: [] };
      entries.push(current);
    } else if (line.startsWith('- ') && current) {
      current.items.push(line.replace(/^-\s*/, ''));
    }
  }
  return entries;
}

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
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLog = () => {
    if (entries.length > 0) return;
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}UPDATELOG.md`)
      .then(r => r.text())
      .then(t => setEntries(parseLog(t)))
      .catch(() => setEntries([{ date: '오류', items: ['업데이트 내역을 불러오지 못했습니다.'] }]))
      .finally(() => setLoading(false));
  };

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
        <button onClick={() => { setShowLog(true); loadLog(); }}>업데이트 내역</button>
      </div>
      {showLog && (
        <div className="modal-backdrop" onClick={() => setShowLog(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>업데이트 내역</h2>
            {loading && <p>불러오는 중...</p>}
            <div style={{ maxHeight: '60vh', overflow: 'auto', textAlign: 'left' }}>
              {entries.map((e, i) => (
                <section key={i} style={{ marginBottom: 12 }}>
                  <h3 style={{ margin: '8px 0 4px' }}>{e.date}</h3>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {e.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                </section>
              ))}
            </div>
            <button onClick={() => setShowLog(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
