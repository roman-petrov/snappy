// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Scene or character art from a creative brief`, ru: `Иллюстрация сцены или персонажа` },
    emoji: `🎨`,
    group: `visual`,
    title: { en: `Illustration`, ru: `Иллюстрация` },
  },
  prompt: {
    en: `I want a custom illustration — I'll describe the scene or character.`,
    ru: `Хочу авторскую иллюстрацию — опишу сцену или персонажа.`,
  },
  skill: `image-editing`,
  tools: SnappyPresetTools.visual,
} as const;
