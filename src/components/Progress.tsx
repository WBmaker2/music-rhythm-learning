import { useState } from 'react';
import { PATTERNS } from '../patterns';
import { loadProgress, saveProgress } from '../storage';

export default function Progress() {
  const [p, setP] = useState(loadProgress());
  const refresh = () => setP(loadProgress());
  const reset = () => { saveProgress({ patternsCompleted: [], bestScores: {} }); refresh(); };

  return (
    <div className="progress">
      <h2>진행도</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {PATTERNS.map(pat => {
          const s = p.bestScores[pat.id];
          const done = p.patternsCompleted.includes(pat.id);
          return (
            <li key={pat.id} style={{ padding: '8px 0', borderBottom: '1px solid #334155' }}>
              <strong>{pat.name}</strong> {done && '✅'}
              <div style={{ color: '#94a3b8', fontSize: 13 }}>
                {s ? `최고 정확도: ${Math.round(s.accuracy*100)}%, 최대 콤보: ${s.maxCombo}` : '아직 점수가 없습니다'}
              </div>
            </li>
          );
        })}
      </ul>
      <button onClick={reset}>진행도 초기화</button>
    </div>
  );
}
