let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let recorderDest: MediaStreamAudioDestinationNode | null = null;
let timbre: OscillatorType = 'sine';

export function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
    recorderDest = ctx.createMediaStreamDestination();
    masterGain.connect(recorderDest);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setTimbre(t: OscillatorType) { timbre = t; }
export function getTimbre() { return timbre; }
export function setVolume(v: number) {
  getCtx();
  if (masterGain) masterGain.gain.value = v;
}
export function getRecorderStream(): MediaStream {
  getCtx();
  return recorderDest!.stream;
}

export function midiToFreq(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function playNote(midi: number, when?: number, duration = 0.4, velocity = 0.8) {
  const c = getCtx();
  const t = when ?? c.currentTime;
  const osc = c.createOscillator();
  osc.type = timbre;
  osc.frequency.value = midiToFreq(midi);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(velocity * 0.3, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(gain);
  gain.connect(masterGain!);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export function playDrum(kind: 'kick' | 'snare' | 'hihat', when?: number) {
  const c = getCtx();
  const t = when ?? c.currentTime;
  if (kind === 'kick') {
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    const g = c.createGain();
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(g); g.connect(masterGain!);
    osc.start(t); osc.stop(t + 0.25);
  } else if (kind === 'snare') {
    const bufSize = c.sampleRate * 0.15;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.6, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    src.connect(filter); filter.connect(g); g.connect(masterGain!);
    src.start(t);
  } else {
    const bufSize = c.sampleRate * 0.05;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    src.connect(filter); filter.connect(g); g.connect(masterGain!);
    src.start(t);
  }
}

export function playMiss() {
  const c = getCtx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 120;
  const g = c.createGain();
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(g); g.connect(masterGain!);
  osc.start(t); osc.stop(t + 0.15);
}

let metroInterval: number | null = null;
export function startMetronome(bpm: number, onBeat?: (beat: number) => void) {
  stopMetronome();
  const c = getCtx();
  const interval = 60 / bpm;
  let beat = 0;
  const tick = () => {
    playDrum('hihat', c.currentTime);
    if (onBeat) onBeat(beat++);
  };
  tick();
  metroInterval = window.setInterval(tick, interval * 1000);
}
export function stopMetronome() {
  if (metroInterval !== null) {
    clearInterval(metroInterval);
    metroInterval = null;
  }
}
