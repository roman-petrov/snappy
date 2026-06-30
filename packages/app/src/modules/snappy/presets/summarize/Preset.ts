// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Short summary that keeps essential facts`, `Краткое резюме с главными фактами`],
  emoji: `📑`,
  group: `text`,
  title: [`Summarize`, `Сжать текст`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I have a long text I need summarized.`, `У меня длинный текст, его нужно сжать.`],
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
            default: `medium`,
            id: `length`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.length.label`) },
            options: [
              {
                label: { emoji: `✂️`, text: i18n(`ui.field.length.option.short.label`) },
                prompt: i18n(`ui.field.length.option.short.prompt`),
                value: `short`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.length.option.medium.label`) },
                prompt: i18n(`ui.field.length.option.medium.prompt`),
                value: `medium`,
              },
            ],
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
          `Summarize the source text under "Source" below following every bullet in the parameter list. Keep essential facts; no new information. Output only the summary—no preamble.`,
          `Сожми исходник под меткой «Исходник» ниже, строго следуя каждому пункту списка параметров. Только ключевые факты; без выдумок. Выведи только резюме — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.length.label": [`Summary length`, `Длина резюме`],
        "ui.field.length.option.medium.label": [`Medium`, `Средне`],
        "ui.field.length.option.medium.prompt": [`A few paragraphs with main points.`, `Несколько абзацев с главным.`],
        "ui.field.length.option.short.label": [`Short`, `Кратко`],
        "ui.field.length.option.short.prompt": [`One tight paragraph or bullet list.`, `Один ёмкий абзац или список.`],
        "ui.field.source.label": [`Source`, `Исходник`],
        "ui.field.source.placeholder": [`Paste long text here…`, `Вставьте длинный текст…`],
        "ui.field.source.prompt": [`Source:`, `Исходник:`],
      }),
    }),
  ],
  meta,
};
