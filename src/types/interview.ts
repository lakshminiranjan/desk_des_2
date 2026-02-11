export type InterviewTopic = 'DSA' | 'System Design' | 'React' | '.NET' | 'SQL' | 'Behavioral' | 'General';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TranscriptChunk {
  id: string;
  text: string;
  confidence: number;
  timestamp: number;
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface ContextPayload {
  question: string;
  screenContext: string;
  topic: InterviewTopic;
  difficulty: Difficulty;
}

export interface AnswerSections {
  raw: string;
  suggestedAnswer: string;
  keyPoints: string[];
  followUps: string[];
  snippet?: string;
}
