import type { FC } from 'react';

import type { TranscriptChunk } from '../types/interview';

interface Props {
  transcript: string;
  transcriptLog: TranscriptChunk[];
  screenText: string;
}

export const Transcript: FC<Props> = ({ transcript, transcriptLog, screenText }) => (
  <section className="card">
    <h2>🎙 Detected Question</h2>
    <p>{transcript || 'Waiting for interviewer speech...'}</p>

    <h3>Recent transcript chunks</h3>
    <ul>
      {transcriptLog.slice(-5).reverse().map((chunk) => (
        <li key={chunk.id}>
          <strong>{new Date(chunk.timestamp).toLocaleTimeString()}:</strong> {chunk.text}
        </li>
      ))}
    </ul>

    <h3>On-screen OCR context</h3>
    <p className="mono">{screenText || 'No OCR text yet. Share screen and speak to trigger OCR.'}</p>
  </section>
);
