import type { ContextPayload } from '../types/interview';

export const buildPrompt = (context: ContextPayload) => `You are an interview practice assistant.

Candidate profile:
- 3 years experience
- React, .NET, SQL

Interview Question:
${context.question || 'No spoken question yet.'}

On-screen context:
${context.screenContext || 'No screen context captured yet.'}

Detected Topic: ${context.topic}
Estimated Difficulty: ${context.difficulty}

Provide:
1. Clear structured answer
2. Key talking points
3. Optional follow-up explanation
4. Short code snippet only if relevant

Format your response as:
ANSWER:\n...
KEY_POINTS:\n- ...
FOLLOW_UPS:\n- ...
SNIPPET:\n(optional)
`;
