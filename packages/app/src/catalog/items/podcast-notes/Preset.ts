// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Recording to transcript plus structured show notes`,
      ru: `Запись в расшифровку и структурированные заметки`,
    },
    emoji: `🎙️`,
    group: `audio`,
    title: { en: `Podcast notes`, ru: `Заметки к подкасту` },
  },
  prompt: {
    en: `I have a podcast or talk recording — I need transcript and structured notes.`,
    ru: `Есть запись подкаста или выступления — нужна расшифровка и структурированные заметки.`,
  },
  tools: SnappyPresetTools.audio,
} as const;
