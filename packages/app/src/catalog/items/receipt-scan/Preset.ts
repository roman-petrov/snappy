// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `List items, amounts, and total from a receipt photo`,
      ru: `Позиции, суммы и итог по фото чека`,
    },
    emoji: `🧾`,
    group: `vision`,
    title: { en: `Parse receipt`, ru: `Разбор чека` },
  },
  prompt: {
    en: `I have a receipt photo — I need items and amounts listed.`,
    ru: `Есть фото чека — нужен список позиций и сумм.`,
  },
  tools: SnappyPresetTools.vision,
} as const;
