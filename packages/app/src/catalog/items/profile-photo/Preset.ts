// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Portrait polish for profile, CV, or social avatar`,
      ru: `Портрет для профиля, резюме или аватара`,
    },
    emoji: `👤`,
    group: `edit`,
    title: { en: `Profile photo`, ru: `Фото профиля` },
  },
  prompt: {
    en: `I need a polished profile photo — I'll share the portrait.`,
    ru: `Нужно аккуратное фото профиля — пришлю портрет.`,
  },
  skill: `image-editing`,
  tools: SnappyPresetTools.edit,
} as const;
