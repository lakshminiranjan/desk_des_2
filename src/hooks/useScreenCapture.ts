import { useCallback, useEffect, useRef } from 'react';

import { interviewStore } from '../store/interviewStore';

interface OCRWorkerResponse {
  type: 'ocr_result' | 'ocr_error';
  text?: string;
  error?: string;
}

export const useScreenCapture = (onExtractedText: (text: string) => void) => {
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const latestSpeechTs = useRef<number>(0);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/ocr.worker.ts', import.meta.url));

    workerRef.current.onmessage = (event: MessageEvent<OCRWorkerResponse>) => {
      if (event.data.type === 'ocr_result') {
        interviewStore.setState({ ocrStatus: 'idle' });
        onExtractedText((event.data.text || '').trim());
      }
      if (event.data.type === 'ocr_error') {
        interviewStore.setState({ ocrStatus: 'error', ocrError: event.data.error || 'OCR failed' });
      }
    };

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [onExtractedText]);

  const startScreenShare = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    streamRef.current = stream;
    interviewStore.setState({ isScreenShared: true, ocrError: undefined });

    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();
    videoRef.current = video;

    stream.getVideoTracks()[0]?.addEventListener('ended', () => {
      interviewStore.setState({ isScreenShared: false });
    });
  }, []);

  const stopScreenShare = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    videoRef.current = null;
    interviewStore.setState({ isScreenShared: false });
  }, []);

  const noteSpeechDetected = useCallback((timestamp: number) => {
    latestSpeechTs.current = timestamp;
  }, []);

  const runOCR = useCallback(async () => {
    if (!videoRef.current || !workerRef.current) return;
    if (Date.now() - latestSpeechTs.current > 20000) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = Math.floor(video.videoWidth * 0.7);
    const height = Math.floor(video.videoHeight * 0.6);
    const sx = Math.floor((video.videoWidth - width) / 2);
    const sy = Math.floor((video.videoHeight - height) / 2);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, sx, sy, width, height, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    interviewStore.setState({ ocrStatus: 'running', ocrError: undefined });
    workerRef.current.postMessage({ type: 'run_ocr', dataUrl });
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (interviewStore.getState().isScreenShared) {
        void runOCR();
      }
    }, 2500);

    return () => window.clearInterval(interval);
  }, [runOCR]);

  return { startScreenShare, stopScreenShare, noteSpeechDetected, runOCR };
};
