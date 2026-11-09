import { useState } from 'react';
import type { Mode } from './types';
import './App.css';
import Home from './components/Home';
import Piano from './components/Piano';
import Drums from './components/Drums';
import RhythmGame from './components/RhythmGame';
import Melody from './components/Melody';
import Recorder from './components/Recorder';
import Progress from './components/Progress';
import Settings from './components/Settings';

export default function App() {
  const [mode, setMode] = useState<Mode>('home');
  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setMode('home')}>🎵 음악/리듬 학습</button>
        <nav>
          {([['piano','피아노'],['drums','드럼'],['rhythm','리듬'],['melody','멜로디'],['record','녹음'],['progress','진행도'],['settings','설정']] as [Mode,string][]).map(([m,label]) => (
            <button key={m} className={mode===m?'active':''} onClick={()=>setMode(m)}>{label}</button>
          ))}
        </nav>
      </header>
      <main>
        {mode==='home' && <Home go={setMode} />}
        {mode==='piano' && <Piano />}
        {mode==='drums' && <Drums />}
        {mode==='rhythm' && <RhythmGame />}
        {mode==='melody' && <Melody />}
        {mode==='record' && <Recorder />}
        {mode==='progress' && <Progress />}
        {mode==='settings' && <Settings />}
      </main>
    </div>
  );
}
