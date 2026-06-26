// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Restyle a photo with a new look or mood`, ru: `Новый стиль или настроение фото` },
    emoji: `🎭`,
    group: `edit`,
    title: { en: `Restyle photo`, ru: `Сменить стиль фото` },
  },
  prompt: {
    en: `I want a new visual style for my photo — I'll share the image.`,
    ru: `Хочу новый визуальный стиль для фото — пришлю снимок.`,
  },
  skill: `image-editing`,
  tools: SnappyPresetTools.edit,
} as const;
