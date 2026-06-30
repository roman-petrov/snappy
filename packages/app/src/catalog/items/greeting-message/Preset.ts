// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Heartfelt greetings for any occasion`, ru: `Тёплые поздравления на любой повод` },
    emoji: `💌`,
    group: `text`,
    title: { en: `Greeting message`, ru: `Поздравление` },
  },
  prompt: {
    en: `I need a greeting or congratulations message.`,
    ru: `Мне нужно поздравление или приветственное сообщение.`,
  },
  skill: `greeting-text`,
  tools: SnappyPresetTools.text,
} as const;
