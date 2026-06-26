// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Talk or presentation script with clear flow`,
      ru: `Текст выступления или презентации с логикой`,
    },
    emoji: `🎤`,
    group: `text`,
    title: { en: `Speech script`, ru: `Текст выступления` },
  },
  prompt: {
    en: `I need a speech or talk script — I'll describe the occasion and message.`,
    ru: `Нужен текст выступления — опишу повод и главную мысль.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
