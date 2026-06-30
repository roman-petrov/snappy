// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Quick tour of what Snappy can do`, `Краткий обзор возможностей Snappy`],
  emoji: `🧭`,
  group: `plan`,
  title: [`Snappy tour`, `Тур по Snappy`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I'm new to Snappy — show me what it can do.`, `Я новичок в Snappy — покажи, что умеет.`],
      skill: `help`,
      tools: [`ask`, `date-time`, `publish-text`, `skill`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            default: `general`,
            id: `interest`,
            kind: `single_choice`,
            label: { emoji: `🎯`, text: i18n(`ui.field.interest.label`) },
            options: [
              {
                label: { emoji: `✏️`, text: i18n(`ui.field.interest.option.text.label`) },
                prompt: i18n(`ui.field.interest.option.text.prompt`),
                value: `text`,
              },
              {
                label: { emoji: `🖼️`, text: i18n(`ui.field.interest.option.visual.label`) },
                prompt: i18n(`ui.field.interest.option.visual.prompt`),
                value: `visual`,
              },
              {
                label: { emoji: `🧭`, text: i18n(`ui.field.interest.option.general.label`) },
                prompt: i18n(`ui.field.interest.option.general.prompt`),
                value: `general`,
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
          `Write a concise Snappy product tour following every bullet in the parameter list. Mention presets, Snappy agent vs step-by-step flows, and 3–5 example use cases. Output only the tour—no preamble.`,
          `Напиши краткий тур по Snappy, строго следуя каждому пункту списка параметров. Пресеты, агент Snappy vs пошаговые сценарии, 3–5 примеров. Выведи только тур — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.interest.label": [`I'm interested in`, `Меня интересует`],
        "ui.field.interest.option.general.label": [`Everything`, `Всё`],
        "ui.field.interest.option.general.prompt": [`Balanced overview of all areas.`, `Сбалансированный обзор всего.`],
        "ui.field.interest.option.text.label": [`Text`, `Текст`],
        "ui.field.interest.option.text.prompt": [
          `Emphasize writing and text presets.`,
          `Акцент на текст и текстовые пресеты.`,
        ],
        "ui.field.interest.option.visual.label": [`Images`, `Картинки`],
        "ui.field.interest.option.visual.prompt": [
          `Emphasize image and visual presets.`,
          `Акцент на изображения и визуальные пресеты.`,
        ],
      }),
    }),
  ],
  meta,
};
