// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Stronger CV structure, wording, and impact`,
      ru: `Структура, формулировки и сильные акценты в резюме`,
    },
    emoji: `📄`,
    group: `text`,
    title: { en: `Resume / CV`, ru: `Резюме` },
  },
  prompt: {
    en: `I need help with my resume — I'll share the draft or key experience.`,
    ru: `Нужна помощь с резюме — пришлю черновик или ключевой опыт.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
