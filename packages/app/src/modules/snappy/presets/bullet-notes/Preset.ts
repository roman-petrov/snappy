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
            default: `bullets`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.format.label`) },
            options: [
              {
                label: { emoji: `•`, text: i18n(`ui.field.format.option.bullets.label`) },
                prompt: i18n(`ui.field.format.option.bullets.prompt`),
                value: `bullets`,
              },
              {
                label: { emoji: `1️⃣`, text: i18n(`ui.field.format.option.numbered.label`) },
                prompt: i18n(`ui.field.format.option.numbered.prompt`),
                value: `numbered`,
              },
            ],
          },
          {
            default: `medium`,
            id: `length`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.length.label`) },
            options: [
              {
                label: { emoji: `⬇️`, text: i18n(`ui.field.length.option.brief.label`) },
                prompt: i18n(`ui.field.length.option.brief.prompt`),
                value: `brief`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.length.option.medium.label`) },
                prompt: i18n(`ui.field.length.option.medium.prompt`),
                value: `medium`,
              },
              {
                label: { emoji: `⬆️`, text: i18n(`ui.field.length.option.detailed.label`) },
                prompt: i18n(`ui.field.length.option.detailed.prompt`),
                value: `detailed`,
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
          `Convert the source text under "Source" below into concise bullet notes following every bullet in the parameter list. One idea per bullet; no filler. Output only the bullets—no preamble.`,
          `Преврати исходный текст под меткой «Исходник» ниже в краткие тезисы, строго следуя каждому пункту списка параметров. Одна мысль на пункт. Выведи только тезисы — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.format.label": [`Format`, `Формат`],
        "ui.field.format.option.bullets.label": [`Bullets`, `Маркеры`],
        "ui.field.format.option.bullets.prompt": [
          `Use bullet markers (• or -) for each point.`,
          `Используй маркеры (• или -) для каждого пункта.`,
        ],
        "ui.field.format.option.numbered.label": [`Numbered`, `Нумерация`],
        "ui.field.format.option.numbered.prompt": [
          `Use numbered list (1, 2, 3…) for each point.`,
          `Используй нумерованный список (1, 2, 3…) для каждого пункта.`,
        ],
        "ui.field.length.label": [`Length`, `Длина`],
        "ui.field.length.option.brief.label": [`Brief`, `Кратко`],
        "ui.field.length.option.brief.prompt": [
          `Keep bullets short—one line each, core facts only.`,
          `Короткие тезисы — по одной строке, только суть.`,
        ],
        "ui.field.length.option.detailed.label": [`Detailed`, `Подробно`],
        "ui.field.length.option.detailed.prompt": [
          `Allow longer bullets with supporting detail where useful.`,
          `Допускай более длинные пункты с уточняющими деталями.`,
        ],
        "ui.field.length.option.medium.label": [`Medium`, `Средне`],
        "ui.field.length.option.medium.prompt": [
          `Balanced length—enough context per bullet without fluff.`,
          `Сбалансированная длина — достаточно контекста без воды.`,
        ],
        "ui.field.source.label": [`Source`, `Исходник`],
        "ui.field.source.placeholder": [`Paste messy notes here…`, `Вставьте сырые заметки…`],
        "ui.field.source.prompt": [`Source:`, `Исходник:`],
      }),
    }),
  ],
  meta,
};
