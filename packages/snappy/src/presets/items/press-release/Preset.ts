// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Press release with lead, quotes, and facts`, ru: `Пресс-релиз с лидом, цитатами и фактами` },
    emoji: `🗞️`,
    group: `text`,
    title: { en: `Press release`, ru: `Пресс-релиз` },
  },
  prompt: {
    en: `I need a press release — I'll share the news and key facts.`,
    ru: `Нужен пресс-релиз — расскажу новость и ключевые факты.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
