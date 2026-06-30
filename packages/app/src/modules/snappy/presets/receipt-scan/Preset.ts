// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Line items and totals from receipt photos`, `Позиции и суммы с чеков`],
  emoji: `🧾`,
  group: `vision`,
  title: [`Receipt scan`, `Чек`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I photographed a receipt — I need items and totals extracted.`,
        `Сфотографировал чек — нужно извлечь позиции и суммы.`,
      ],
      tools: [`ask`, `date-time`, `look-image`, `publish-text`],
    }),
    Flow.staticVision(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `🧾`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
          {
            default: `items`,
            id: `focus`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.focus.label`) },
            options: [
              {
                label: { emoji: `📋`, text: i18n(`ui.field.focus.option.items.label`) },
                prompt: i18n(`ui.field.focus.option.items.prompt`),
                value: `items`,
              },
              {
                label: { emoji: `💰`, text: i18n(`ui.field.focus.option.totals.label`) },
                prompt: i18n(`ui.field.focus.option.totals.prompt`),
                value: `totals`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Extract data from the receipt image following every bullet in the parameter list. Use a clear list format. If a value is unreadable, mark it as unclear. Output only the extraction—no preamble.`,
          `Извлеки данные с чека на изображении, строго следуя каждому пункту списка параметров. Чёткий список. Нечитаемое помечай как неясное. Выведи только извлечение — без вступления.`,
        ],
        "ui.field.focus.label": [`Focus`, `Фокус`],
        "ui.field.focus.option.items.label": [`Line items`, `Позиции`],
        "ui.field.focus.option.items.prompt": [
          `List each line item with quantity and price when visible.`,
          `Каждая позиция с количеством и ценой, если видно.`,
        ],
        "ui.field.focus.option.totals.label": [`Totals only`, `Только итоги`],
        "ui.field.focus.option.totals.prompt": [
          `Emphasize subtotal, tax, and total; include items only if needed.`,
          `Акцент на промежуточный итог, налог и сумму; позиции — только при необходимости.`,
        ],
        "ui.field.image.label": [`Receipt photo`, `Фото чека`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
