// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Priorities and time blocks for the coming week`, ru: `Приоритеты и блоки времени на неделю` },
    emoji: `📅`,
    group: `plan`,
    title: { en: `Weekly plan`, ru: `План на неделю` },
  },
  prompt: {
    en: `I need a plan for the week — I'll share goals and constraints.`,
    ru: `Нужен план на неделю — расскажу цели и ограничения.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
