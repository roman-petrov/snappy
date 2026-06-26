// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Remove distractions or unwanted objects`, ru: `Убрать лишнее с фото` },
    emoji: `✂️`,
    group: `edit`,
    title: { en: `Remove object`, ru: `Удалить объект` },
  },
  prompt: {
    en: `I need something removed from a photo — I'll share the image.`,
    ru: `Нужно убрать объект с фото — пришлю снимок.`,
  },
  skill: `image-editing`,
  tools: SnappyPresetTools.edit,
} as const;
