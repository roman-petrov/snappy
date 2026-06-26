// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Compare options with pros, cons, and trade-offs`,
      ru: `Сравнение вариантов: плюсы, минусы, компромиссы`,
    },
    emoji: `⚖️`,
    group: `plan`,
    title: { en: `Decision help`, ru: `Помощь с выбором` },
  },
  prompt: {
    en: `I'm choosing between options — I'll list them and what matters to me.`,
    ru: `Выбираю между вариантами — перечислю их и что для меня важно.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
