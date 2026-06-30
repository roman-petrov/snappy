// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Discover what Snappy can do for your goal`, ru: `Узнайте, что Snappy умеет для вашей задачи` },
    emoji: `✨`,
    group: `plan`,
    title: { en: `Snappy tour`, ru: `Обзор Snappy` },
  },
  prompt: { en: `What can Snappy do for me?`, ru: `Что Snappy может сделать для меня?` },
  skill: `help`,
  tools: SnappyPresetTools.help,
} as const;
