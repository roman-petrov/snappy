// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Structured ideation with diverse options`, ru: `Структурированный поиск идей` },
    emoji: `💡`,
    group: `plan`,
    title: { en: `Brainstorm`, ru: `Мозговой штурм` },
  },
  prompt: {
    en: `I need creative ideas — I'll describe the topic and constraints.`,
    ru: `Нужны идеи — опишу тему и ограничения.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
