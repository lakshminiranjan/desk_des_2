import type { AnswerSections } from '../types/interview';

const API_URL = import.meta.env.VITE_LLM_API_URL || 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MODEL = import.meta.env.VITE_LLM_MODEL || 'gpt-4o-mini';

const sectionBetween = (text: string, start: string, end?: string) => {
  const startIdx = text.indexOf(start);
  if (startIdx < 0) return '';
  const from = startIdx + start.length;
  const to = end ? text.indexOf(end, from) : text.length;
  return text.slice(from, to < 0 ? text.length : to).trim();
};

const parseBullets = (block: string) =>
  block
    .split('\n')
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);

export const parseAnswerSections = (raw: string): AnswerSections => {
  const suggestedAnswer = sectionBetween(raw, 'ANSWER:', 'KEY_POINTS:');
  const keyPoints = parseBullets(sectionBetween(raw, 'KEY_POINTS:', 'FOLLOW_UPS:'));
  const followUps = parseBullets(sectionBetween(raw, 'FOLLOW_UPS:', 'SNIPPET:'));
  const snippet = sectionBetween(raw, 'SNIPPET:') || undefined;

  return { raw, suggestedAnswer: suggestedAnswer || raw, keyPoints, followUps, snippet };
};

export const generateAnswer = async (prompt: string, signal?: AbortSignal): Promise<AnswerSections> => {
  if (!API_KEY) {
    return parseAnswerSections(
      'ANSWER:\nSet VITE_OPENAI_API_KEY in your .env file to enable live LLM responses.\nKEY_POINTS:\n- Use STAR for behavioral questions\n- Clarify assumptions before answering\nFOLLOW_UPS:\n- Ask if the interviewer wants deeper technical detail\nSNIPPET:\n// LLM disabled in this environment',
    );
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`LLM request failed with ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return parseAnswerSections(content);
};
