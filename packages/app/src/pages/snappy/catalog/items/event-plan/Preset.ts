// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Timeline, checklist, and roles for an event`, ru: `Таймлайн, чек-лист и роли для мероприятия` },
    emoji: `🎉`,
    group: `plan`,
    title: { en: `Event plan`, ru: `План мероприятия` },
  },
  prompt: {
    en: `I'm planning an event — I'll describe the format and date.`,
    ru: `Планирую мероприятие — опишу формат и дату.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
