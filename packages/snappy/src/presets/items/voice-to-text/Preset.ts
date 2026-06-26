// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Transcribe voice memos into readable text`, ru: `Голосовые заметки в текст` },
    emoji: `🎙️`,
    group: `audio`,
    title: { en: `Voice to text`, ru: `Голос в текст` },
  },
  prompt: {
    en: `I have a voice recording — I need an accurate transcript.`,
    ru: `Есть голосовая запись — нужна точная расшифровка.`,
  },
  tools: SnappyPresetTools.audio,
} as const;
