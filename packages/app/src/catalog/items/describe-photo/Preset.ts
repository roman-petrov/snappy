// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Detailed description of people, objects, and scene`,
      ru: `Подробное описание людей, предметов и сцены`,
    },
    emoji: `👁️`,
    group: `vision`,
    title: { en: `Describe photo`, ru: `Что на фото` },
  },
  prompt: {
    en: `I want to know what's in a photo — I'll upload the image.`,
    ru: `Хочу узнать, что на фото — загружу изображение.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
