// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Read and translate text visible in an image`, ru: `Прочитать и перевести текст с изображения` },
    emoji: `🌐`,
    group: `vision`,
    title: { en: `Translate from photo`, ru: `Перевод с фото` },
  },
  prompt: {
    en: `I need text from a photo translated — I'll share the image and target language.`,
    ru: `Нужно перевести текст с фото — пришлю снимок и укажу язык перевода.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
