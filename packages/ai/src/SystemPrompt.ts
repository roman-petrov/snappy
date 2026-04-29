import { StructuredPrompt } from "@snappy/core";

import type { AiLocale } from "./Types";

export const SystemPrompt = (locale: AiLocale) =>
  StructuredPrompt([
    [
      `language_policy`,
      [
        `Mandatory language for this session: ${locale === `ru` ? `Russian` : `English`} (locale: ${locale}).`,
        `Use only this language in all assistant messages.`,
        `Use only this language in tool calls, including function arguments and any tool-facing text.`,
        `Do not mix languages unless the user explicitly asks for multilingual output.`,
      ].join(`\n`),
    ],
  ] as const);
