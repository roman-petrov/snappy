// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Brand mark or logo concept before full identity work`,
      ru: `Концепт знака или логотипа до полного брендинга`,
    },
    emoji: `🏷️`,
    group: `visual`,
    title: { en: `Logo concept`, ru: `Концепт логотипа` },
  },
  prompt: {
    en: `I need a logo or brand mark concept — I'll describe the business.`,
    ru: `Нужен концепт логотипа или знака — опишу бизнес.`,
  },
  skill: `icon-generation`,
  tools: SnappyPresetTools.visual,
} as const;
