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
            default: `expense`,
            id: `purpose`,
            kind: `single_choice`,
            label: { emoji: `🎯`, text: i18n(`ui.field.purpose.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.purpose.option.expense.label`) },
                prompt: i18n(`ui.field.purpose.option.expense.prompt`),
                value: `expense`,
              },
              {
                label: { emoji: `📊`, text: i18n(`ui.field.purpose.option.tax.label`) },
                prompt: i18n(`ui.field.purpose.option.tax.prompt`),
                value: `tax`,
              },
              {
                label: { emoji: `🏠`, text: i18n(`ui.field.purpose.option.personal.label`) },
                prompt: i18n(`ui.field.purpose.option.personal.prompt`),
                value: `personal`,
              },
            ],
          },
          {
            default: `list`,
            id: `outputFormat`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.outputFormat.label`) },
            options: [
              {
                label: { emoji: `📋`, text: i18n(`ui.field.outputFormat.option.list.label`) },
                prompt: i18n(`ui.field.outputFormat.option.list.prompt`),
                value: `list`,
              },
              {
                label: { emoji: `📊`, text: i18n(`ui.field.outputFormat.option.table.label`) },
                prompt: i18n(`ui.field.outputFormat.option.table.prompt`),
                value: `table`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Extract data from the receipt image following every bullet in the parameter list. Use a clear list format. If a value is unreadable, mark it as unclear. Output only the extraction—no preamble.`,
          `Извлеки данные с чека на изображении, строго следуя каждому пункту списка параметров. Чёткий список. Нечитаемое помечай как неясное. Выведи только извлечение — без вступления.`,
        ],
        "ui.field.image.label": [`Receipt photo`, `Фото чека`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
        "ui.field.outputFormat.label": [`Format`, `Формат`],
        "ui.field.outputFormat.option.list.label": [`List`, `Список`],
        "ui.field.outputFormat.option.list.prompt": [
          `Line-by-line list with totals at end.`,
          `Построчный список с итогами в конце.`,
        ],
        "ui.field.outputFormat.option.table.label": [`Table`, `Таблица`],
        "ui.field.outputFormat.option.table.prompt": [
          `Markdown table: item, qty, price, total.`,
          `Markdown-таблица: позиция, кол-во, цена, сумма.`,
        ],
        "ui.field.purpose.label": [`Purpose`, `Назначение`],
        "ui.field.purpose.option.expense.label": [`Expense report`, `Expense report`],
        "ui.field.purpose.option.expense.prompt": [
          `Include date, merchant, category hints for reimbursement.`,
          `Дата, merchant, категории для reimbursement.`,
        ],
        "ui.field.purpose.option.personal.label": [`Personal`, `Личное`],
        "ui.field.purpose.option.personal.prompt": [
          `Simple summary for personal budgeting.`,
          `Простая сводка для личного бюджета.`,
        ],
        "ui.field.purpose.option.tax.label": [`Tax`, `Налоги`],
        "ui.field.purpose.option.tax.prompt": [
          `Emphasize tax, VAT, and deductible line items.`,
          `Акцент на налог, НДС и deductible-позиции.`,
        ],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
