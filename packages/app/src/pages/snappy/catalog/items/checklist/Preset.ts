// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Turn goals or notes into an actionable checklist`,
      ru: `Цели или заметки в чек-лист с действиями`,
    },
    emoji: `✅`,
    group: `plan`,
    title: { en: `Checklist`, ru: `Чек-лист` },
  },
  prompt: {
    en: `I have goals or messy notes — I need a clear actionable checklist.`,
    ru: `Есть цели или черновые заметки — нужен понятный чек-лист действий.`,
  },
  tools: SnappyPresetTools.plan,
} as const;
