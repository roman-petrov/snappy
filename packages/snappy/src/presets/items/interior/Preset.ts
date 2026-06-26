// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Room makeover concepts from your brief`, ru: `Концепт интерьера по вашему брифу` },
    emoji: `🏠`,
    group: `visual`,
    title: { en: `Interior concept`, ru: `Интерьер` },
  },
  prompt: { en: `I want an interior design concept image.`, ru: `Хочу концепт интерьера.` },
  skill: `interior-generation`,
  tools: SnappyPresetTools.visual,
} as const;
