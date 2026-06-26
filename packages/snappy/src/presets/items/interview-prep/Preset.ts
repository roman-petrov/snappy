// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Practice questions and answer angles for an interview`,
      ru: `Вопросы и углы ответов к собеседованию`,
    },
    emoji: `🎯`,
    group: `plan`,
    title: { en: `Interview prep`, ru: `Подготовка к интервью` },
  },
  prompt: {
    en: `I have a job interview — I'll describe the role and my background.`,
    ru: `Предстоит собеседование — опишу вакансию и свой опыт.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
