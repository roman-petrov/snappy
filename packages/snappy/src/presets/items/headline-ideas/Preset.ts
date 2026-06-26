// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Catchy titles and headline variants`, ru: `Цепляющие заголовки и варианты` },
    emoji: `📰`,
    group: `text`,
    title: { en: `Headline ideas`, ru: `Заголовки` },
  },
  prompt: {
    en: `I have a topic or draft and need strong headline options.`,
    ru: `Есть тема или черновик — нужны сильные варианты заголовка.`,
  },
  skill: `text-improvement`,
  tools: SnappyPresetTools.text,
} as const;
