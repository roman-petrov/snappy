import type { AiChatMessage, AiChatUserContent } from "@snappy/ai";
import type { Locale } from "@snappy/intl";

import { StructuredPrompt } from "@snappy/core";

const languagePolicy = (locale: Locale) =>
  StructuredPrompt([
    [
      `language_policy`,
      locale === `ru`
        ? `ВАЖНО: всегда отвечай на русском языке. Используй русский для каждой пользовательской строки в ответе.`
        : `IMPORTANT: Always respond in English. Use the same language for every user-visible string in your reply.`,
    ],
  ]);

const messages = (locale: Locale, content: AiChatUserContent): AiChatMessage[] => [
  { content: languagePolicy(locale), role: `system` },
  { content, role: `user` },
];

const withPolicy = (locale: Locale, content: string) => `${languagePolicy(locale)}\n\n${content}`;

export const StaticAgentChat = { messages, withPolicy };
