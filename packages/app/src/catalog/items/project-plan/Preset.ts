// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Break a goal into phases, tasks, and milestones`, ru: `Разбить цель на этапы и задачи` },
    emoji: `🗂️`,
    group: `plan`,
    title: { en: `Project plan`, ru: `План проекта` },
  },
  prompt: {
    en: `I have a project — I need it broken into clear steps.`,
    ru: `Есть проект — нужно разбить его на понятные шаги.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
