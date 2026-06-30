// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Informative visuals with labels and hierarchy`, ru: `Наглядная инфографика с акцентами` },
    emoji: `📈`,
    group: `visual`,
    title: { en: `Infographic`, ru: `Инфографика` },
  },
  prompt: { en: `I need an infographic image.`, ru: `Нужна инфографика.` },
  skill: `visual-diagram-generation`,
  tools: SnappyPresetTools.visual,
} as const;
