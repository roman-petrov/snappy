// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Extract and format text from a photo or scan`,
      ru: `Извлечь и оформить текст с фото или скана`,
    },
    emoji: `📄`,
    group: `vision`,
    title: { en: `Extract from document`, ru: `Текст с документа` },
  },
  prompt: {
    en: `I have a document photo — I need the text extracted and formatted.`,
    ru: `Есть фото документа — нужно извлечь и оформить текст.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
