// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Explain, debug, or rewrite code from a screenshot`,
      ru: `Объяснение, отладка или переписывание кода со скрина`,
    },
    emoji: `💻`,
    group: `vision`,
    title: { en: `Code from screenshot`, ru: `Код со скриншота` },
  },
  prompt: {
    en: `I have a code screenshot — I'll share it and say what I need.`,
    ru: `Есть скриншот с кодом — пришлю и скажу, что нужно сделать.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
