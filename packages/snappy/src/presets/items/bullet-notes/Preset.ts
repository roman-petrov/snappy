// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Messy notes into structured bullets`, ru: `Заметки в структурированные пункты` },
    emoji: `📝`,
    group: `text`,
    title: { en: `Bullet notes`, ru: `Структура заметок` },
  },
  prompt: { en: `I have messy notes that need structure.`, ru: `У меня черновые заметки, их нужно структурировать.` },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
