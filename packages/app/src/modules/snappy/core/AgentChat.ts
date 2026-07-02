import type { AiChatMessage, AiChatUserContent } from "@snappy/ai";

import { StructuredPrompt } from "@snappy/core";
import { Bilingual, type Locale } from "@snappy/intl";

const policy = [
  `IMPORTANT: Always respond in English. Use the same language for every user-visible string in your reply.`,
  `ВАЖНО: всегда отвечай на русском языке. Используй русский для каждой пользовательской строки в ответе.`,
] as const satisfies Bilingual;

const languagePolicy = (locale: Locale) => StructuredPrompt([[`language_policy`, Bilingual.pick(locale, policy)]]);

const messages = (locale: Locale, content: AiChatUserContent): AiChatMessage[] => [
  { content: languagePolicy(locale), role: `system` },
  { content, role: `user` },
];

const prefixed = (locale: Locale, content: string) => `${languagePolicy(locale)}\n\n${content}`;

const transcriptSection = (locale: Locale, transcript: string) =>
  `${Bilingual.pick(locale, [`Transcript`, `Расшифровка`])}:\n${transcript}`;

export const AgentChat = { messages, prefixed, transcriptSection };
