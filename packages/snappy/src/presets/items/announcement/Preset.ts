// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Team or customer announcements with clear next steps`,
      ru: `Объявления для команды или клиентов`,
    },
    emoji: `📣`,
    group: `text`,
    title: { en: `Announcement`, ru: `Объявление` },
  },
  prompt: {
    en: `I need an announcement — I'll describe the news and audience.`,
    ru: `Нужно объявление — опишу новость и аудиторию.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
