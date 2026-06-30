// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Short summary that keeps essential facts`, ru: `Краткое резюме с главными фактами` },
    emoji: `📋`,
    group: `text`,
    title: { en: `Summarize`, ru: `Сжать текст` },
  },
  prompt: { en: `I have a long text I need summarized.`, ru: `У меня длинный текст, его нужно сжать.` },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
