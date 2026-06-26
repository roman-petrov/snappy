// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: {
      en: `Professional replies to reviews and feedback`,
      ru: `Вежливые ответы на отзывы и обратную связь`,
    },
    emoji: `💬`,
    group: `text`,
    title: { en: `Review reply`, ru: `Ответ на отзыв` },
  },
  prompt: {
    en: `I need to reply to a review or comment — I'll share what was said.`,
    ru: `Нужно ответить на отзыв или комментарий — расскажу, что написали.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
