// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Tailored cover letter for a role or company`,
      ru: `Сопроводительное письмо под вакансию или компанию`,
    },
    emoji: `📝`,
    group: `text`,
    title: { en: `Cover letter`, ru: `Сопроводительное` },
  },
  prompt: {
    en: `I need a cover letter — I'll describe the role and my background.`,
    ru: `Нужно сопроводительное письмо — опишу вакансию и свой опыт.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
