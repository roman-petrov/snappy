// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Plain-language explanation of charts and diagrams`, `Понятное объяснение схем и диаграмм`],
  emoji: `🧩`,
  group: `vision`,
  title: [`Explain diagram`, `Объяснить схему`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I have a diagram or chart — I need it explained in plain language.`,
        `Есть схема или диаграмма — нужно объяснение простым языком.`,
      ],
      tools: [`ask`, `date-time`, `look-image`, `publish-text`],
    }),
    Flow.staticVision(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `📊`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
          {
            default: `general`,
            id: `audience`,
            kind: `single_choice`,
            label: { emoji: `👥`, text: i18n(`ui.field.audience.label`) },
            options: [
              {
                label: { emoji: `🎓`, text: i18n(`ui.field.audience.option.expert.label`) },
                prompt: i18n(`ui.field.audience.option.expert.prompt`),
                value: `expert`,
              },
              {
                label: { emoji: `💼`, text: i18n(`ui.field.audience.option.general.label`) },
                prompt: i18n(`ui.field.audience.option.general.prompt`),
                value: `general`,
              },
              {
                label: { emoji: `🌱`, text: i18n(`ui.field.audience.option.beginner.label`) },
                prompt: i18n(`ui.field.audience.option.beginner.prompt`),
                value: `beginner`,
              },
            ],
          },
          {
            id: `context`,
            kind: `text_input`,
            label: { emoji: `💡`, text: i18n(`ui.field.context.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.context.placeholder`),
            prompt: i18n(`ui.field.context.prompt`),
          },
        ]),
      localization: () => ({
        "prompt": [
          `Explain the diagram or chart in the image following every bullet in the parameter list. Cover purpose, main elements, flows or trends, and takeaways. Output only the explanation—no preamble.`,
          `Объясни диаграмму или схему на изображении, строго следуя каждому пункту списка параметров. Назначение, элементы, потоки или тренды, выводы. Выведи только объяснение — без вступления.`,
        ],
        "ui.field.audience.label": [`Audience`, `Аудитория`],
        "ui.field.audience.option.beginner.label": [`Beginner`, `Новичок`],
        "ui.field.audience.option.beginner.prompt": [
          `Use simple language; avoid jargon or define it.`,
          `Простой язык; без жаргона или с пояснением.`,
        ],
        "ui.field.audience.option.expert.label": [`Expert`, `Эксперт`],
        "ui.field.audience.option.expert.prompt": [
          `Technical depth is fine; be precise.`,
          `Допустима техническая глубина; будь точен.`,
        ],
        "ui.field.audience.option.general.label": [`General`, `Общая`],
        "ui.field.audience.option.general.prompt": [
          `Balanced explanation for a mixed audience.`,
          `Сбалансированное объяснение для широкой аудитории.`,
        ],
        "ui.field.context.label": [`Context (optional)`, `Контекст (необязательно)`],
        "ui.field.context.placeholder": [
          `Q3 sales dashboard for exec review…`,
          `Дашборд продаж Q3 для review…`,
        ],
        "ui.field.context.prompt": [`Context:`, `Контекст:`],
        "ui.field.image.label": [`Diagram`, `Диаграмма`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
