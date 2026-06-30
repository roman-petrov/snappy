// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Fix clarity, tone, length, and formatting`, ru: `Ясность, тон, длина и оформление` },
    emoji: `✏️`,
    group: `text`,
    title: { en: `Improve text`, ru: `Улучшение текста` },
  },
  prompt: { en: `I need to improve a piece of text.`, ru: `Мне нужно улучшить текст.` },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
