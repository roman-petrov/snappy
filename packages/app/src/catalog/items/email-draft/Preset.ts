// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Clear professional emails from bullet points`, ru: `Деловые письма из тезисов` },
    emoji: `📧`,
    group: `text`,
    title: { en: `Email draft`, ru: `Черновик письма` },
  },
  prompt: {
    en: `I need a professional email — I'll describe the situation and key points.`,
    ru: `Нужно деловое письмо — опишу ситуацию и главные тезисы.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
