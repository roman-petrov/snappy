// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Same meaning, new tone or register`, ru: `Тот же смысл — другой тон` },
    emoji: `🎭`,
    group: `text`,
    title: { en: `Rewrite tone`, ru: `Сменить тон` },
  },
  prompt: { en: `I need this text rewritten in a different tone.`, ru: `Нужно переписать текст в другом тоне.` },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
