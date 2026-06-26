// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Retouch, enhance, or adjust existing photos`, ru: `Ретушь и улучшение фото` },
    emoji: `🖼️`,
    group: `edit`,
    title: { en: `Photo edit`, ru: `Редактура фото` },
  },
  prompt: {
    en: `I need to edit a photo — I'll share the image and what to change.`,
    ru: `Нужно отредактировать фото — пришлю снимок и что изменить.`,
  },
  skill: `image-editing`,
  tools: SnappyPresetTools.edit,
} as const;
