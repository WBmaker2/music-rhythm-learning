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
      {!recording ? <button onClick={start}>⏺ 녹음 시작</button> : <button onClick={stop}>⏹ 녹음 중지</button>}
      {url && (
        <>
          <audio controls src={url} />
          <a href={url} download="recording.webm">다운로드</a>
        </>
      )}
      <p className="hint">녹음 중 피아노/드럼을 연주하면 소리가 함께 저장됩니다.</p>
    </div>
  );
}
