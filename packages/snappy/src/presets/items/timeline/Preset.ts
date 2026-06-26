// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Timeline diagram for milestones and sequence`, ru: `Таймлайн с этапами и последовательностью` },
    emoji: `⏳`,
    group: `visual`,
    title: { en: `Timeline`, ru: `Таймлайн` },
  },
  prompt: {
    en: `I need a timeline diagram — I'll list events or milestones.`,
    ru: `Нужен таймлайн — перечислю события или этапы.`,
  },
  skill: `visual-diagram-generation`,
  tools: SnappyPresetTools.visual,
} as const;
