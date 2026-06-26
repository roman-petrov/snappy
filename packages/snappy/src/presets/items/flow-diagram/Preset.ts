// cspell:disable
import { SnappyPresetTools } from "../../Tools";

export const Preset = {
  meta: {
    description: { en: `Flowcharts and process diagrams as images`, ru: `Блок-схемы и процессы в виде картинки` },
    emoji: `📊`,
    group: `visual`,
    title: { en: `Flow diagram`, ru: `Схема процесса` },
  },
  prompt: { en: `I need a flowchart or process diagram.`, ru: `Нужна блок-схема или диаграмма процесса.` },
  skill: `visual-diagram-generation`,
  tools: SnappyPresetTools.visual,
} as const;
