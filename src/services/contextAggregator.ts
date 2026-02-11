import type { ContextPayload, Difficulty, InterviewTopic, QAPair } from '../types/interview';

const topicMatchers: Array<{ topic: InterviewTopic; regex: RegExp }> = [
  { topic: 'DSA', regex: /(array|tree|graph|algorithm|complexity|leetcode|linked list)/i },
  { topic: 'System Design', regex: /(scalability|load balancer|microservice|architecture|distributed)/i },
  { topic: 'React', regex: /(react|hook|state|component|redux|context api)/i },
  { topic: '.NET', regex: /(c#|\.net|asp\.net|entity framework)/i },
  { topic: 'SQL', regex: /(sql|join|index|database|query|normalization)/i },
  { topic: 'Behavioral', regex: /(conflict|challenge|team|stakeholder|deadline|leadership)/i },
];

const dedupe = (text: string) =>
  [...new Set(text.split(/\n+/).map((line) => line.trim()).filter(Boolean))].join('\n');

const inferDifficulty = (question: string): Difficulty => {
  const lower = question.toLowerCase();
  if (/optimi[sz]e|design|tradeoff|distributed|concurrency/.test(lower)) return 'Hard';
  if (/implement|build|compare|explain/.test(lower)) return 'Medium';
  return 'Easy';
};

const inferTopic = (question: string, screenText: string): InterviewTopic => {
  const haystack = `${question} ${screenText}`;
  return topicMatchers.find((matcher) => matcher.regex.test(haystack))?.topic ?? 'General';
};

export const buildContext = (params: {
  transcript: string;
  screenText: string;
  history: QAPair[];
}): ContextPayload => {
  const historyText = params.history
    .slice(-3)
    .map((entry) => `Q: ${entry.question}\nA: ${entry.answer}`)
    .join('\n');

  const question = dedupe([params.transcript, historyText].filter(Boolean).join('\n')).slice(0, 1000);
  const screenContext = dedupe(params.screenText).slice(0, 2500);

  return {
    question,
    screenContext,
    topic: inferTopic(question, screenContext),
    difficulty: inferDifficulty(question),
  };
};
