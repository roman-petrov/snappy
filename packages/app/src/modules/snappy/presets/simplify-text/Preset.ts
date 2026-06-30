// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Make complex text easier to read`, `Упростить сложный текст`],
  emoji: `🪶`,
  group: `text`,
  title: [`Simplify text`, `Упростить текст`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `Simplify this text for a general audience — I'll paste it.`,
        `Упрости текст для широкой аудитории — вставлю его.`,
      ],
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
            default: `general`,
            id: `audience`,
            kind: `single_choice`,
            label: { emoji: `👥`, text: i18n(`ui.field.audience.label`) },
            options: [
              {
                label: { emoji: `🌱`, text: i18n(`ui.field.audience.option.beginner.label`) },
                prompt: i18n(`ui.field.audience.option.beginner.prompt`),
                value: `beginner`,
              },
              {
                label: { emoji: `👥`, text: i18n(`ui.field.audience.option.general.label`) },
                prompt: i18n(`ui.field.audience.option.general.prompt`),
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
          `Simplify the source text under "Source" below following every bullet in the parameter list. Shorter sentences, plain words, same facts. Output only the simplified text—no preamble.`,
          `Упрости исходник под меткой «Исходник» ниже, строго следуя каждому пункту списка параметров. Короче предложения, простые слова, те же факты. Выведи только текст — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.audience.label": [`Audience`, `Аудитория`],
        "ui.field.audience.option.beginner.label": [`Beginner`, `Новичок`],
        "ui.field.audience.option.beginner.prompt": [`Very simple language.`, `Очень простой язык.`],
        "ui.field.audience.option.general.label": [`General`, `Общая`],
        "ui.field.audience.option.general.prompt": [`Plain language for adults.`, `Простой язык для взрослых.`],
        "ui.field.source.label": [`Source`, `Исходник`],
        "ui.field.source.placeholder": [`Paste complex text…`, `Вставьте сложный текст…`],
        "ui.field.source.prompt": [`Source:`, `Исходник:`],
      }),
    }),
  ],
  meta,
};
