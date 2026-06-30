// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: { en: `Exposure, color, and clarity improvements`, ru: `Свет, цвет и резкость — улучшение качества` },
    emoji: `✨`,
    group: `edit`,
    title: { en: `Enhance photo`, ru: `Улучшить фото` },
  },
  prompt: {
    en: `I want to improve the quality of my photo — color, light, or sharpness.`,
    ru: `Хочу улучшить качество фото — цвет, свет или резкость.`,
  },
  skill: `image-editing`,
  tools: SnappyPresetTools.edit,
} as const;
