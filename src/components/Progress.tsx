import { useState } from 'react';
import { PATTERNS } from '../patterns';
import { loadProgress, saveProgress } from '../storage';

export default function Progress() {
  const [p, setP] = useState(loadProgress());
  const refresh = () => setP(loadProgress());
  const reset = () => { saveProgress({ patternsCompleted: [], bestScores: {} }); refresh(); };

  return (
    <div className="progress">
      <h2>Progress</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {PATTERNS.map(pat => {
          const s = p.bestScores[pat.id];
          const done = p.patternsCompleted.includes(pat.id);
          return (
            <li key={pat.id} style={{ padding: '8px 0', borderBottom: '1px solid #334155' }}>
              <strong>{pat.name}</strong> {done && '✅'}
              <div style={{ color: '#94a3b8', fontSize: 13 }}>
                {s ? `Best accuracy: ${Math.round(s.accuracy*100)}%, max combo: ${s.maxCombo}` : 'No score yet'}
              </div>
            </li>
          );
        })}
      </ul>
      <button onClick={reset}>Reset Progress</button>
    </div>
  );
}
