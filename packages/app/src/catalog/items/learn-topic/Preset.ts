// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Explain a topic at your level with examples`,
      ru: `Объяснение темы с примерами под ваш уровень`,
    },
    emoji: `📚`,
    group: `plan`,
    title: { en: `Learn topic`, ru: `Разобрать тему` },
  },
  prompt: {
    en: `I want to understand a topic — I'll say what I know and my level.`,
    ru: `Хочу разобраться в теме — скажу, что уже знаю и мой уровень.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
