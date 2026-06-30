// cspell:word промпта
import { AiConstants } from "@snappy/ai";

import type { Bilingual } from "./Bilingual";

const { maxImagePromptLength } = AiConstants;
const visualNoWatermark = [`End: no watermark.`, `Без водяного знака.`] as const satisfies Bilingual;

const visualReplyStringOnly = [
  `Reply with that string only—no other text.`,
  `Ответь только строкой промпта.`,
] as const satisfies Bilingual;

const visualCharLimit = [
  `Hard limit: keep the final prompt string at or below ${maxImagePromptLength} characters; compress wording if needed.`,
  `Лимит: не длиннее ${maxImagePromptLength} символов; сожми при необходимости.`,
] as const satisfies Bilingual;

const joinVisualMeta = (body: Bilingual): Bilingual => [
  `${body[0]} ${visualNoWatermark[0]} ${visualCharLimit[0]} ${visualReplyStringOnly[0]}`,
  `${body[1]} ${visualNoWatermark[1]} ${visualCharLimit[1]} ${visualReplyStringOnly[1]}`,
];

export const Prompts = {
  emoji: {
    off: [`No emoji.`, `Без эмодзи.`] as const satisfies Bilingual,
    on: {
      generous: [
        `Add emoji generously: several per section or paragraph where they fit meaning; place them to reinforce tone, not at random. Keep lines readable—do not crowd them or replace words with emoji alone.`,
        `Добавляй эмодзи щедро: по нескольку на абзац или блок, где они усиливают смысл; не хаотично. Строки должны оставаться читаемыми — не перегружай и не заменяй слова одними эмодзи.`,
      ] as const satisfies Bilingual,
      moderate: [
        `Use emoji where they reinforce meaning; keep the text readable.`,
        `Эмодзи там, где усиливают смысл; текст остаётся читаемым.`,
      ] as const satisfies Bilingual,
    },
  },
  formatting: {
    off: [`Plain text only (no markup).`, `Только простой текст (без разметки).`] as const satisfies Bilingual,
    on: [
      `Format with GitHub-Flavored Markdown. Use **bold** and *italic* generously throughout—highlight key phrases, emotional beats, names, and calls to action; alternate emphasis so the text scans easily. Do not leave long stretches of unmarked plain text when markup is on.`,
      `Оформи GitHub-Flavored Markdown. Щедро используй **жирный** и *курсив* по всему тексту — выделяй ключевые фразы, эмоциональные акценты, имена и призывы; чередуй акценты, чтобы текст легко читался. Не оставляй длинные куски без разметки, если разметка включена.`,
    ] as const satisfies Bilingual,
  },
  visual: {
    charLimit: visualCharLimit,
    joinMeta: joinVisualMeta,
    noWatermark: visualNoWatermark,
    replyStringOnly: visualReplyStringOnly,
  },
} as const;
