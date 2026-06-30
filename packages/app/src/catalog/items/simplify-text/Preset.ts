// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Dense text made plain without losing meaning`, ru: `Сложный текст проще, без потери смысла` },
    emoji: `🔍`,
    group: `text`,
    title: { en: `Simplify text`, ru: `Упростить текст` },
  },
  prompt: {
    en: `I have dense or complex text that needs simplifying.`,
    ru: `Есть сложный или перегруженный текст — его нужно упростить.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
