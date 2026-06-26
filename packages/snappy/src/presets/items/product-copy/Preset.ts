// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Persuasive copy for products and services`, ru: `Продающий текст о продукте или услуге` },
    emoji: `🛒`,
    group: `text`,
    title: { en: `Product copy`, ru: `Текст о продукте` },
  },
  prompt: {
    en: `I need selling copy for a product or service — I'll describe it.`,
    ru: `Нужен продающий текст — опишу продукт или услугу.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
