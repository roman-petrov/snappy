// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Explain charts, diagrams, or whiteboard photos`, ru: `Объяснение графиков, схем и фото доски` },
    emoji: `📊`,
    group: `vision`,
    title: { en: `Explain diagram`, ru: `Разбор схемы` },
  },
  prompt: {
    en: `I have a chart or diagram — I'll share the image and my context.`,
    ru: `Есть график или схема — пришлю изображение и контекст.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
