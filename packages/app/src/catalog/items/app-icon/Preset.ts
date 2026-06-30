// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `App or product icons with consistent style`, ru: `Иконки приложения или продукта` },
    emoji: `🔷`,
    group: `visual`,
    title: { en: `App icon`, ru: `Иконка` },
  },
  prompt: { en: `I need an app or product icon.`, ru: `Нужна иконка приложения или продукта.` },
  skill: `icon-generation`,
  tools: SnappyPresetTools.visual,
} as const;
