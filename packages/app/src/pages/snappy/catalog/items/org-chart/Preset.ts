// cspell:disable
import { SnappyPresetTools } from "@snappy/snappy";

export const Preset = {
  meta: {
    description: {
      en: `Org structure diagram with roles and reporting lines`,
      ru: `Оргструктура с ролями и линиями подчинения`,
    },
    emoji: `🏢`,
    group: `visual`,
    title: { en: `Org chart`, ru: `Оргструктура` },
  },
  prompt: {
    en: `I need an org chart — I'll describe teams and reporting lines.`,
    ru: `Нужна оргструктура — опишу команды и подчинение.`,
  },
  skill: `visual-diagram-generation`,
  tools: SnappyPresetTools.visual,
} as const;
