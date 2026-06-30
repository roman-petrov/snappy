// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Clear job posting that attracts the right candidates`,
      ru: `Понятная вакансия, которая привлекает нужных кандидатов`,
    },
    emoji: `🧑‍💼`,
    group: `text`,
    title: { en: `Job posting`, ru: `Вакансия` },
  },
  prompt: {
    en: `I need a job posting — I'll describe the role and team.`,
    ru: `Нужен текст вакансии — опишу роль и команду.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
