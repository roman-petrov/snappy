// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Translate text visible in a photo`, `Перевод текста с фотографии`],
  emoji: `🌐`,
  group: `vision`,
  title: [`Translate photo`, `Перевод с фото`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`There's text in a photo — I need it translated.`, `На фото есть текст — нужен перевод.`],
      tools: [`ask`, `date-time`, `look-image`, `publish-text`],
    }),
    Flow.staticVision(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
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
        ]),
      localization: () => ({
        "prompt": [
          `Read all visible text in the image and translate it following every bullet in the parameter list. Preserve line breaks where helpful. Output only the translation—no preamble.`,
          `Прочитай весь видимый текст на изображении и переведи, строго следуя каждому пункту списка параметров. Сохраняй переносы строк где уместно. Выведи только перевод — без вступления.`,
        ],
        "ui.field.image.label": [`Photo with text`, `Фото с текстом`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
        "ui.field.targetLang.label": [`Translate to`, `Перевести на`],
        "ui.field.targetLang.option.en.label": [`English`, `English`],
        "ui.field.targetLang.option.en.prompt": [`Translate into English.`, `Переведи на английский.`],
        "ui.field.targetLang.option.ru.label": [`Russian`, `Русский`],
        "ui.field.targetLang.option.ru.prompt": [`Translate into Russian.`, `Переведи на русский.`],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
