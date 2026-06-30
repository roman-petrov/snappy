// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Detailed description of people, objects, and scene`, `Подробное описание людей, предметов и сцены`],
  emoji: `👁️`,
  group: `vision`,
  title: [`Describe photo`, `Что на фото`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I want to know what's in a photo — I'll upload the image.`,
        `Хочу узнать, что на фото — загружу изображение.`,
      ],
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
            default: `detailed`,
            id: `detail`,
            kind: `single_choice`,
            label: { emoji: `🔍`, text: i18n(`ui.field.detail.label`) },
            options: [
              {
                label: { emoji: `📝`, text: i18n(`ui.field.detail.option.brief.label`) },
                prompt: i18n(`ui.field.detail.option.brief.prompt`),
                value: `brief`,
              },
              {
                label: { emoji: `📖`, text: i18n(`ui.field.detail.option.detailed.label`) },
                prompt: i18n(`ui.field.detail.option.detailed.prompt`),
                value: `detailed`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Describe the uploaded image following every bullet in the parameter list. Cover people, objects, setting, actions, and notable details. Output only the description—no preamble.`,
          `Опиши загруженное изображение, строго следуя каждому пункту списка параметров. Люди, предметы, обстановка, действия и заметные детали. Выведи только описание — без вступления.`,
        ],
        "ui.field.detail.label": [`Detail level`, `Уровень детализации`],
        "ui.field.detail.option.brief.label": [`Brief`, `Кратко`],
        "ui.field.detail.option.brief.prompt": [
          `Short overview: main subjects and scene in a few sentences.`,
          `Краткий обзор: главные объекты и сцена в нескольких предложениях.`,
        ],
        "ui.field.detail.option.detailed.label": [`Detailed`, `Подробно`],
        "ui.field.detail.option.detailed.prompt": [
          `Thorough description with fine details, colors, and spatial layout.`,
          `Подробное описание с деталями, цветами и расположением объектов.`,
        ],
        "ui.field.image.label": [`Photo`, `Фото`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
