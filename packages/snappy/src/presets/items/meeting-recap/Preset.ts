// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Meeting recording into notes with action items`, ru: `Запись встречи в заметки и задачи` },
    emoji: `🤝`,
    group: `audio`,
    title: { en: `Meeting recap`, ru: `Итоги встречи` },
  },
  prompt: {
    en: `I have a meeting recording — I need notes with action items.`,
    ru: `Есть запись встречи — нужны заметки с задачами.`,
  },
  tools: SnappyPresetTools.audio,
} as const;
