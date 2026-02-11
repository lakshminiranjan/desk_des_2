import { useCallback, useMemo, useRef } from 'react';

import { AnswerPanel } from './components/AnswerPanel';
import { ControlPanel } from './components/ControlPanel';
import { Transcript } from './components/Transcript';
import { useScreenCapture } from './hooks/useScreenCapture';
import { useSpeech } from './hooks/useSpeech';
import { buildContext } from './services/contextAggregator';
import { generateAnswer } from './services/llmClient';
import { buildPrompt } from './services/promptBuilder';
import { interviewStore, useInterviewStore } from './store/interviewStore';
import type { SpeechResult } from './hooks/useSpeech';
import './app.css';

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const App = () => {
  const state = useInterviewStore();
  const pendingControllerRef = useRef<AbortController | null>(null);

  const runAnswerPipeline = useCallback(async () => {
    const snapshot = interviewStore.getState();
    if (!snapshot.transcript) return;

    const context = buildContext({
      transcript: snapshot.transcript,
      screenText: snapshot.screenText,
      history: snapshot.history,
    });

    const prompt = buildPrompt(context);
    pendingControllerRef.current?.abort();
    const controller = new AbortController();
    pendingControllerRef.current = controller;

    try {
      const answer = await generateAnswer(prompt, controller.signal);
      interviewStore.setState({ answer });
      interviewStore.appendHistory({
        id: createId(),
        question: context.question,
        answer: answer.suggestedAnswer,
        timestamp: Date.now(),
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      interviewStore.setState({
        answer: {
          raw: '',
          suggestedAnswer: error instanceof Error ? error.message : 'Unable to generate answer',
          keyPoints: [],
          followUps: [],
        },
      });
    }
  }, []);

  const { startScreenShare, stopScreenShare, noteSpeechDetected, runOCR } = useScreenCapture((text) => {
    interviewStore.setState({ screenText: text });
    void runAnswerPipeline();
  });

  const handleSpeech = useCallback(
    (result: SpeechResult) => {
      noteSpeechDetected(result.timestamp);
      interviewStore.appendTranscript({ ...result, id: createId() });
      void runOCR();
      void runAnswerPipeline();
    },
    [noteSpeechDetected, runOCR, runAnswerPipeline],
  );

  const { isSupported, startListening, stopListening } = useSpeech(handleSpeech);



  const runDemoScenario = useCallback(() => {
    const demoSpeech = {
      id: createId(),
      text: 'Design a React data table component that handles 10,000 rows with sorting, filtering, and pagination.',
      confidence: 0.99,
      timestamp: Date.now(),
    };

    interviewStore.appendTranscript(demoSpeech);
    interviewStore.setState({
      screenText:
        'Requirements: virtualized rows, reusable column config, debounced filters, memoized row rendering, and accessibility support.',
    });

    void runAnswerPipeline();
  }, [runAnswerPipeline]);
  const statusText = useMemo(() => {
    if (!isSupported) return 'Speech recognition is not supported in this browser.';
    return 'Everything runs in-browser. No backend, no analytics, no auto-answer injection.';
  }, [isSupported]);

  return (
    <main className="app-shell">
      <header>
        <h1>Interview Practice Assistant</h1>
        <p>{statusText}</p>
      </header>

      <ControlPanel
        isListening={state.isListening}
        isScreenShared={state.isScreenShared}
        onStartListening={startListening}
        onStopListening={stopListening}
        onStartSharing={() => void startScreenShare()}
        onStopSharing={stopScreenShare}
        onClearSession={() => interviewStore.resetSession()}
        onRunDemo={runDemoScenario}
      />

      <section className="layout-grid">
        <Transcript
          transcript={state.transcript}
          transcriptLog={state.transcriptLog}
          screenText={state.screenText}
        />
        <AnswerPanel answer={state.answer} ocrStatus={state.ocrStatus} ocrError={state.ocrError} />
      </section>
    </main>
  );
};
