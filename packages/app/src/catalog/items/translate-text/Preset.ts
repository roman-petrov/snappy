// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Natural translation preserving tone and meaning`,
      ru: `Естественный перевод с сохранением смысла и тона`,
    },
    emoji: `🔤`,
    group: `text`,
    title: { en: `Translate text`, ru: `Перевод текста` },
  },
  prompt: {
    en: `I need text translated — I'll paste it and say the target language.`,
    ru: `Нужно перевести текст — вставлю его и укажу язык перевода.`,
  },
  tools: SnappyPresetTools.text,
} as const;
