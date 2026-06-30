// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Clear Q&A pairs for support pages`, ru: `Понятные вопросы и ответы для FAQ` },
    emoji: `❓`,
    group: `text`,
    title: { en: `FAQ draft`, ru: `Черновик FAQ` },
  },
  prompt: { en: `I need FAQ entries for my product.`, ru: `Нужны вопросы и ответы для FAQ продукта.` },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
