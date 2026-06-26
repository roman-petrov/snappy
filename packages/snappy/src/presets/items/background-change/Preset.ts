// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Replace or clean up the background in a photo`, ru: `Замена или очистка фона на фото` },
    emoji: `🖼️`,
    group: `edit`,
    title: { en: `Change background`, ru: `Сменить фон` },
  },
  prompt: { en: `I need to change or remove the background in my photo.`, ru: `Нужно сменить или убрать фон на фото.` },
  skill: `image-editing`,
  tools: SnappyPresetTools.edit,
} as const;
