// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Extract text from photos of documents`, `Текст с фотографий документов`],
  emoji: `📄`,
  group: `vision`,
  title: [`Document scan`, `Скан документа`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I photographed a document — I need the text extracted.`,
        `Сфотографировал документ — нужно извлечь текст.`,
      ],
      tools: [`ask`, `date-time`, `look-image`, `publish-text`],
    }),
    Flow.staticVision(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `📄`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
          {
            default: `plain`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📝`, text: i18n(`ui.field.format.label`) },
            options: [
              {
                label: { emoji: `📃`, text: i18n(`ui.field.format.option.plain.label`) },
                prompt: i18n(`ui.field.format.option.plain.prompt`),
                value: `plain`,
              },
              {
                label: { emoji: `📑`, text: i18n(`ui.field.format.option.markdown.label`) },
                prompt: i18n(`ui.field.format.option.markdown.prompt`),
                value: `markdown`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Extract all readable text from the document image. Follow every bullet in the parameter list. Preserve paragraph breaks; fix obvious OCR-like errors only when confident. Output only the extracted text—no commentary.`,
          `Извлеки весь читаемый текст с изображения документа. Строго следуй каждому пункту списка параметров. Сохраняй абзацы; исправляй явные ошибки только когда уверен. Выведи только текст — без комментариев.`,
        ],
        "ui.field.format.label": [`Output format`, `Формат вывода`],
        "ui.field.format.option.markdown.label": [`Markdown`, `Markdown`],
        "ui.field.format.option.markdown.prompt": [
          `Use headings and lists where the document structure suggests them.`,
          `Используй заголовки и списки, где структура документа это подсказывает.`,
        ],
        "ui.field.format.option.plain.label": [`Plain text`, `Простой текст`],
        "ui.field.format.option.plain.prompt": [`Plain text only, no markup.`, `Только простой текст, без разметки.`],
        "ui.field.image.label": [`Document photo`, `Фото документа`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
