// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Translate text between languages`, `Перевод текста`],
  emoji: `🌍`,
  group: `text`,
  title: [`Translate text`, `Перевод текста`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need text translated — I'll paste the source and target language.`,
        `Нужен перевод — вставлю текст и целевой язык.`,
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
            default: `ru`,
            id: `targetLang`,
            kind: `single_choice`,
            label: { emoji: `🌍`, text: i18n(`ui.field.targetLang.label`) },
            options: [
              {
                label: { emoji: `🇬🇧`, text: i18n(`ui.field.targetLang.option.en.label`) },
                prompt: i18n(`ui.field.targetLang.option.en.prompt`),
                value: `en`,
              },
              {
                label: { emoji: `🇷🇺`, text: i18n(`ui.field.targetLang.option.ru.label`) },
                prompt: i18n(`ui.field.targetLang.option.ru.prompt`),
                value: `ru`,
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
          `Translate the source text under "Source" below following every bullet in the parameter list. Preserve meaning and tone; natural phrasing. Output only the translation—no preamble.`,
          `Переведи исходник под меткой «Исходник» ниже, строго следуя каждому пункту списка параметров. Сохрани смысл и тон; естественные формулировки. Выведи только перевод — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.source.label": [`Source`, `Исходник`],
        "ui.field.source.placeholder": [`Paste text to translate…`, `Вставьте текст для перевода…`],
        "ui.field.source.prompt": [`Source:`, `Исходник:`],
        "ui.field.targetLang.label": [`Translate to`, `Перевести на`],
        "ui.field.targetLang.option.en.label": [`English`, `English`],
        "ui.field.targetLang.option.en.prompt": [`Translate into English.`, `Переведи на английский.`],
        "ui.field.targetLang.option.ru.label": [`Russian`, `Русский`],
        "ui.field.targetLang.option.ru.prompt": [`Translate into Russian.`, `Переведи на русский.`],
      }),
    }),
  ],
  meta,
};
