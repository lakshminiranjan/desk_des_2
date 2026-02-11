import { useSyncExternalStore } from 'react';

import type { AnswerSections, QAPair, TranscriptChunk } from '../types/interview';

export interface InterviewStoreState {
  isListening: boolean;
  isScreenShared: boolean;
  transcript: string;
  screenText: string;
  answer: AnswerSections | null;
  history: QAPair[];
  transcriptLog: TranscriptChunk[];
  ocrStatus: 'idle' | 'running' | 'error';
  ocrError?: string;
}

const initialState: InterviewStoreState = {
  isListening: false,
  isScreenShared: false,
  transcript: '',
  screenText: '',
  answer: null,
  history: [],
  transcriptLog: [],
  ocrStatus: 'idle',
};

let state = initialState;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export const interviewStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setState: (nextState: Partial<InterviewStoreState>) => {
    state = { ...state, ...nextState };
    emit();
  },
  appendTranscript: (chunk: TranscriptChunk) => {
    state = {
      ...state,
      transcript: chunk.text,
      transcriptLog: [...state.transcriptLog, chunk].slice(-20),
    };
    emit();
  },
  appendHistory: (entry: QAPair) => {
    state = {
      ...state,
      history: [...state.history, entry].slice(-3),
    };
    emit();
  },
  resetSession: () => {
    state = initialState;
    emit();
  },
};

export const useInterviewStore = () => useSyncExternalStore(interviewStore.subscribe, interviewStore.getState);
