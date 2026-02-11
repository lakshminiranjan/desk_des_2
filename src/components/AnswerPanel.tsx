import type { FC } from 'react';

import type { AnswerSections } from '../types/interview';

interface Props {
  answer: AnswerSections | null;
  ocrStatus: string;
  ocrError?: string;
}

export const AnswerPanel: FC<Props> = ({ answer, ocrStatus, ocrError }) => (
  <section className="card">
    <h2>🧠 Suggested Answer</h2>
    <p>{answer?.suggestedAnswer || 'Structured answer will appear here in real time.'}</p>

    <h3>🔑 Key Points</h3>
    <ul>
      {answer?.keyPoints?.length
        ? answer.keyPoints.map((point) => <li key={point}>{point}</li>)
        : 'No key points yet.'}
    </ul>

    <h3>💡 Follow-ups</h3>
    <ul>
      {answer?.followUps?.length
        ? answer.followUps.map((item) => <li key={item}>{item}</li>)
        : 'No follow-ups yet.'}
    </ul>

    {answer?.snippet && (
      <>
        <h3>Code Snippet</h3>
        <pre>{answer.snippet}</pre>
      </>
    )}

    <p className="helper">OCR status: {ocrStatus}{ocrError ? ` • ${ocrError}` : ''}</p>
  </section>
);
