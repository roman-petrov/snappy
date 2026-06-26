// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Greeting card art with occasion and palette options`,
      ru: `Открытка с выбором повода и палитры`,
    },
    emoji: `💌`,
    group: `visual`,
    title: { en: `Postcard art`, ru: `Открытка` },
  },
  prompt: { en: `I want a greeting card illustration.`, ru: `Хочу иллюстрацию для открытки.` },
  skill: `postcard-generation`,
  tools: SnappyPresetTools.visual,
} as const;
