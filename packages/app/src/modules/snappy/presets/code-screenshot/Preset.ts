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
              {
                label: { emoji: `🐛`, text: i18n(`ui.field.mode.option.debug.label`) },
                prompt: i18n(`ui.field.mode.option.debug.prompt`),
                value: `debug`,
              },
            ],
          },
          {
            default: `standard`,
            id: `explainLevel`,
            kind: `single_choice`,
            label: { emoji: `📊`, text: i18n(`ui.field.explainLevel.label`) },
            options: [
              {
                label: { emoji: `🌱`, text: i18n(`ui.field.explainLevel.option.brief.label`) },
                prompt: i18n(`ui.field.explainLevel.option.brief.prompt`),
                value: `brief`,
              },
              {
                label: { emoji: `📖`, text: i18n(`ui.field.explainLevel.option.standard.label`) },
                prompt: i18n(`ui.field.explainLevel.option.standard.prompt`),
                value: `standard`,
              },
              {
                label: { emoji: `🔬`, text: i18n(`ui.field.explainLevel.option.deep.label`) },
                prompt: i18n(`ui.field.explainLevel.option.deep.prompt`),
                value: `deep`,
              },
            ],
          },
          {
            default: `typescript`,
            id: `language`,
            kind: `single_choice`,
            label: { emoji: `🔤`, text: i18n(`ui.field.language.label`) },
            options: [
              {
                label: { emoji: `📘`, text: i18n(`ui.field.language.option.typescript.label`) },
                prompt: i18n(`ui.field.language.option.typescript.prompt`),
                value: `typescript`,
              },
              {
                label: { emoji: `🐍`, text: i18n(`ui.field.language.option.python.label`) },
                prompt: i18n(`ui.field.language.option.python.prompt`),
                value: `python`,
              },
              {
                label: { emoji: `☕`, text: i18n(`ui.field.language.option.java.label`) },
                prompt: i18n(`ui.field.language.option.java.prompt`),
                value: `java`,
              },
              {
                label: { emoji: `🔧`, text: i18n(`ui.field.language.option.other.label`) },
                prompt: i18n(`ui.field.language.option.other.prompt`),
                value: `other`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Analyze the code screenshot following every bullet in the parameter list. Output only the result—no preamble.`,
          `Проанализируй скриншот с кодом, строго следуя каждому пункту списка параметров. Выведи только результат — без вступления.`,
        ],
        "ui.field.explainLevel.label": [`Detail`, `Детализация`],
        "ui.field.explainLevel.option.brief.label": [`Brief`, `Кратко`],
        "ui.field.explainLevel.option.brief.prompt": [
          `High-level summary in a few sentences.`,
          `Общее резюме в нескольких предложениях.`,
        ],
        "ui.field.explainLevel.option.deep.label": [`Deep`, `Глубоко`],
        "ui.field.explainLevel.option.deep.prompt": [
          `Line-by-line or block-by-block explanation.`,
          `Построчное или поблочное объяснение.`,
        ],
        "ui.field.explainLevel.option.standard.label": [`Standard`, `Стандарт`],
        "ui.field.explainLevel.option.standard.prompt": [
          `Explain main logic and important constructs.`,
          `Объясни основную логику и важные конструкции.`,
        ],
        "ui.field.image.label": [`Screenshot`, `Скриншот`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
        "ui.field.language.label": [`Language`, `Язык`],
        "ui.field.language.option.java.label": [`Java`, `Java`],
        "ui.field.language.option.java.prompt": [`Assume Java syntax.`, `Предполагай синтаксис Java.`],
        "ui.field.language.option.other.label": [`Other`, `Другой`],
        "ui.field.language.option.other.prompt": [
          `Infer language from the screenshot.`,
          `Определи язык по скриншоту.`,
        ],
        "ui.field.language.option.python.label": [`Python`, `Python`],
        "ui.field.language.option.python.prompt": [`Assume Python syntax.`, `Предполагай синтаксис Python.`],
        "ui.field.language.option.typescript.label": [`TypeScript`, `TypeScript`],
        "ui.field.language.option.typescript.prompt": [`Assume TypeScript/JavaScript syntax.`, `Предполагай синтаксис TypeScript/JavaScript.`],
        "ui.field.mode.label": [`Task`, `Задача`],
        "ui.field.mode.option.debug.label": [`Find issues`, `Найти проблемы`],
        "ui.field.mode.option.debug.prompt": [
          `Spot bugs, smells, or security issues; suggest fixes.`,
          `Найди баги, smells или security-проблемы; предложи фиксы.`,
        ],
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
