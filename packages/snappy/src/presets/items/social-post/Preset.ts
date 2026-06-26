// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Posts for social feeds with hook and CTA`, ru: `Посты для соцсетей с зацепкой и CTA` },
    emoji: `📱`,
    group: `text`,
    title: { en: `Social post`, ru: `Пост в соцсети` },
  },
  prompt: {
    en: `I need a social media post — I'll share the topic and goal.`,
    ru: `Нужен пост для соцсети — расскажу тему и цель.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
