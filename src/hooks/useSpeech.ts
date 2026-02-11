import { useCallback, useEffect, useRef, useState } from 'react';

import { interviewStore } from '../store/interviewStore';

export interface SpeechResult {
  text: string;
  confidence: number;
  timestamp: number;
}

type SpeechRecognitionCtor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export const useSpeech = (onFinalResult: (result: SpeechResult) => void) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result.isFinal) continue;

        const transcript = result[0]?.transcript?.trim();
        if (!transcript) continue;

        onFinalResult({
          text: transcript,
          confidence: result[0]?.confidence ?? 0,
          timestamp: Date.now(),
        });
      }
    };

    recognition.onerror = () => {
      interviewStore.setState({ isListening: false });
    };

    recognition.onend = () => {
      if (interviewStore.getState().isListening) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [onFinalResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.start();
    interviewStore.setState({ isListening: true });
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    interviewStore.setState({ isListening: false });
  }, []);

  return { isSupported, startListening, stopListening };
};
