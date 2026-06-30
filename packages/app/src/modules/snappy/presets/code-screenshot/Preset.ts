// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Explain or transcribe code from a screenshot`, `Объяснение или текст кода со снимка`],
  emoji: `💻`,
  group: `vision`,
  title: [`Code screenshot`, `Код на скриншоте`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I have a screenshot of code — I need help understanding or extracting it.`,
        `Есть скриншот с кодом — нужно понять или извлечь его.`,
      ],
      tools: [`ask`, `date-time`, `look-image`, `publish-text`],
    }),
    Flow.staticVision(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `🖥️`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
          {
            default: `explain`,
            id: `mode`,
            kind: `single_choice`,
            label: { emoji: `⚙️`, text: i18n(`ui.field.mode.label`) },
            options: [
              {
                label: { emoji: `📋`, text: i18n(`ui.field.mode.option.transcribe.label`) },
                prompt: i18n(`ui.field.mode.option.transcribe.prompt`),
                value: `transcribe`,
              },
              {
                label: { emoji: `💡`, text: i18n(`ui.field.mode.option.explain.label`) },
                prompt: i18n(`ui.field.mode.option.explain.prompt`),
                value: `explain`,
              },
            ],
          },
          {
            id: `language`,
            kind: `text_input`,
            label: { emoji: `🔤`, text: i18n(`ui.field.language.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.language.placeholder`),
            prompt: i18n(`ui.field.language.prompt`),
          },
        ]),
      localization: () => ({
        "prompt": [
          `Analyze the code screenshot following every bullet in the parameter list. Output only the result—no preamble.`,
          `Проанализируй скриншот с кодом, строго следуя каждому пункту списка параметров. Выведи только результат — без вступления.`,
        ],
        "ui.field.image.label": [`Screenshot`, `Скриншот`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
        "ui.field.language.label": [`Language hint (optional)`, `Язык (необязательно)`],
        "ui.field.language.placeholder": [`TypeScript, Python…`, `TypeScript, Python…`],
        "ui.field.language.prompt": [`Programming language if known:`, `Язык программирования, если известен:`],
        "ui.field.mode.label": [`Task`, `Задача`],
        "ui.field.mode.option.explain.label": [`Explain`, `Объяснить`],
        "ui.field.mode.option.explain.prompt": [
          `Explain what the code does in clear prose; quote key lines if helpful.`,
          `Объясни, что делает код, понятным текстом; при необходимости процитируй ключевые строки.`,
        ],
        "ui.field.mode.option.transcribe.label": [`Transcribe`, `Переписать код`],
        "ui.field.mode.option.transcribe.prompt": [
          `Transcribe the code as accurately as possible in a fenced code block.`,
          `Максимально точно перепиши код в блоке с ограждением.`,
        ],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
