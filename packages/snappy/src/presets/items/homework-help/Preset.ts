// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Step-by-step help with tasks from a photo`, ru: `Пошаговая помощь с заданием по фото` },
    emoji: `📝`,
    group: `vision`,
    title: { en: `Homework help`, ru: `Домашнее задание` },
  },
  prompt: {
    en: `I need help with homework — I'll send a photo and say the subject and grade.`,
    ru: `Нужна помощь с домашним заданием — пришлю фото и укажу предмет и класс.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
