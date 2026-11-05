import { useState, useRef } from 'react';
import { getRecorderStream } from '../audio/engine';

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const start = () => {
    chunks.current = [];
    const mr = new MediaRecorder(getRecorderStream());
    mr.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setUrl(URL.createObjectURL(blob));
    };
    mr.start();
    mediaRecorder.current = mr;
    setRecording(true);
  };
  const stop = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="recorder">
      {!recording ? <button onClick={start}>⏺ Start Recording</button> : <button onClick={stop}>⏹ Stop</button>}
      {url && (
        <>
          <audio controls src={url} />
          <a href={url} download="recording.webm">Download</a>
        </>
      )}
      <p className="hint">Play piano/drums while recording to capture audio.</p>
    </div>
  );
}
