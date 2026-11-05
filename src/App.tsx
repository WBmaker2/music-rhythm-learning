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
        <button className="brand" onClick={() => setMode('home')}>🎵 Rhythm Learn</button>
        <nav>
          {(['piano','drums','rhythm','melody','record','progress','settings'] as Mode[]).map(m => (
            <button key={m} className={mode===m?'active':''} onClick={()=>setMode(m)}>{m}</button>
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
