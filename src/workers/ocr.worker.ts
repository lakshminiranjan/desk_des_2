/// <reference lib="webworker" />

interface OCRRequest {
  type: 'run_ocr';
  dataUrl: string;
}

interface OCRResponse {
  type: 'ocr_result' | 'ocr_error';
  text?: string;
  error?: string;
}

declare let self: DedicatedWorkerGlobalScope & { Tesseract?: any };
declare function importScripts(...urls: string[]): void;

let isLibraryLoaded = false;

const cleanText = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/[|]{2,}/g, '|')
    .trim();

const ensureTesseractLoaded = () => {
  if (isLibraryLoaded) return;
  importScripts('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js');
  isLibraryLoaded = true;
};

const runOCR = async (dataUrl: string) => {
  ensureTesseractLoaded();
  if (!self.Tesseract) throw new Error('Tesseract failed to load in worker');

  const result = await self.Tesseract.recognize(dataUrl, 'eng');
  return cleanText(result?.data?.text || '');
};

self.onmessage = async (event: MessageEvent<OCRRequest>) => {
  if (event.data.type !== 'run_ocr') return;

  try {
    const text = await runOCR(event.data.dataUrl);
    const response: OCRResponse = { type: 'ocr_result', text };
    self.postMessage(response);
  } catch (error) {
    const response: OCRResponse = {
      type: 'ocr_error',
      error: error instanceof Error ? error.message : 'Unable to run OCR',
    };
    self.postMessage(response);
  }
};

export {};
