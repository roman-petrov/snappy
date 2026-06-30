// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Compact bullet notes from messy input`, `Короткие тезисы из сырого текста`],
  emoji: `📌`,
  group: `text`,
  title: [`Bullet notes`, `Тезисы`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`Turn my notes into clear bullet points.`, `Преврати заметки в чёткие тезисы.`],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `source`,
            kind: `text_input`,
            label: { emoji: `📃`, text: i18n(`ui.field.source.label`) },
            placeholder: i18n(`ui.field.source.placeholder`),
            prompt: i18n(`ui.field.source.prompt`),
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `binary_choice`,
            label: { emoji: `📝`, text: i18n(`ui.field.addFormatting.label`) },
            promptOff: i18n(`ui.field.addFormatting.promptOff`),
            promptOn: i18n(`ui.field.addFormatting.promptOn`),
          },
        ]),
      localization: () => ({
        "prompt": [
          `Convert the source text under "Source" below into concise bullet notes following every bullet in the parameter list. One idea per bullet; no filler. Output only the bullets—no preamble.`,
          `Преврати исходный текст под меткой «Исходник» ниже в краткие тезисы, строго следуя каждому пункту списка параметров. Одна мысль на пункт. Выведи только тезисы — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.source.label": [`Source`, `Исходник`],
        "ui.field.source.placeholder": [`Paste messy notes here…`, `Вставьте сырые заметки…`],
        "ui.field.source.prompt": [`Source:`, `Исходник:`],
      }),
    }),
  ],
  meta,
};
