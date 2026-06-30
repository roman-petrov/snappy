// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Step-by-step help from a photo of a problem`, `Пошаговая помощь по фото задачи`],
  emoji: `📚`,
  group: `vision`,
  title: [`Homework help`, `Помощь с задачей`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I have a homework problem in a photo — I need step-by-step help.`,
        `Есть задача на фото — нужна пошаговая помощь.`,
      ],
      tools: [`ask`, `date-time`, `look-image`, `publish-text`],
    }),
    Flow.staticVision(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `📷`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
          {
            default: `middle`,
            id: `gradeLevel`,
            kind: `single_choice`,
            label: { emoji: `🎓`, text: i18n(`ui.field.gradeLevel.label`) },
            options: [
              {
                label: { emoji: `🌱`, text: i18n(`ui.field.gradeLevel.option.elementary.label`) },
                prompt: i18n(`ui.field.gradeLevel.option.elementary.prompt`),
                value: `elementary`,
              },
              {
                label: { emoji: `📚`, text: i18n(`ui.field.gradeLevel.option.middle.label`) },
                prompt: i18n(`ui.field.gradeLevel.option.middle.prompt`),
                value: `middle`,
              },
              {
                label: { emoji: `🎓`, text: i18n(`ui.field.gradeLevel.option.high.label`) },
                prompt: i18n(`ui.field.gradeLevel.option.high.prompt`),
                value: `high`,
              },
            ],
          },
          {
            default: `math`,
            id: `subject`,
            kind: `single_choice`,
            label: { emoji: `📖`, text: i18n(`ui.field.subject.label`) },
            options: [
              {
                label: { emoji: `🔢`, text: i18n(`ui.field.subject.option.math.label`) },
                prompt: i18n(`ui.field.subject.option.math.prompt`),
                value: `math`,
              },
              {
                label: { emoji: `⚛️`, text: i18n(`ui.field.subject.option.science.label`) },
                prompt: i18n(`ui.field.subject.option.science.prompt`),
                value: `science`,
              },
              {
                label: { emoji: `📜`, text: i18n(`ui.field.subject.option.humanities.label`) },
                prompt: i18n(`ui.field.subject.option.humanities.prompt`),
                value: `humanities`,
              },
            ],
          },
          {
            default: `steps`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🪜`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `💡`, text: i18n(`ui.field.style.option.hints.label`) },
                prompt: i18n(`ui.field.style.option.hints.prompt`),
                value: `hints`,
              },
              {
                label: { emoji: `🪜`, text: i18n(`ui.field.style.option.steps.label`) },
                prompt: i18n(`ui.field.style.option.steps.prompt`),
                value: `steps`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Help with the problem shown in the image following every bullet in the parameter list. Teach the approach; do not just give a final answer without reasoning. Output only the help text—no preamble.`,
          `Помоги с задачей на изображении, строго следуя каждому пункту списка параметров. Объясни подход; не давай только ответ без рассуждений. Выведи только текст помощи — без вступления.`,
        ],
        "ui.field.gradeLevel.label": [`Grade level`, `Класс / уровень`],
        "ui.field.gradeLevel.option.elementary.label": [`Elementary`, `Начальная`],
        "ui.field.gradeLevel.option.elementary.prompt": [
          `Very simple language and small steps.`,
          `Очень простой язык и маленькие шаги.`,
        ],
        "ui.field.gradeLevel.option.high.label": [`High school+`, `Старшие классы+`],
        "ui.field.gradeLevel.option.high.prompt": [
          `More formal reasoning; appropriate rigor.`,
          `Более формальные рассуждения; нужная строгость.`,
        ],
        "ui.field.gradeLevel.option.middle.label": [`Middle school`, `Средняя школа`],
        "ui.field.gradeLevel.option.middle.prompt": [
          `Clear steps with moderate vocabulary.`,
          `Понятные шаги со средним словарём.`,
        ],
        "ui.field.image.label": [`Problem photo`, `Фото задачи`],
        "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
        "ui.field.style.label": [`Help style`, `Стиль помощи`],
        "ui.field.style.option.hints.label": [`Hints only`, `Только подсказки`],
        "ui.field.style.option.hints.prompt": [
          `Give guiding hints; let the student finish key steps.`,
          `Наводящие подсказки; ключевые шаги оставь ученику.`,
        ],
        "ui.field.style.option.steps.label": [`Full steps`, `Полные шаги`],
        "ui.field.style.option.steps.prompt": [
          `Show numbered steps with reasoning through to the answer.`,
          `Пронумерованные шаги с рассуждениями до ответа.`,
        ],
        "ui.field.subject.label": [`Subject`, `Предмет`],
        "ui.field.subject.option.humanities.label": [`Humanities`, `Гуманитарные`],
        "ui.field.subject.option.humanities.prompt": [
          `History, languages, literature approach.`,
          `Подход для истории, языков, литературы.`,
        ],
        "ui.field.subject.option.math.label": [`Math`, `Математика`],
        "ui.field.subject.option.math.prompt": [
          `Show formulas and algebraic steps clearly.`,
          `Ясно показывай формулы и алгебраические шаги.`,
        ],
        "ui.field.subject.option.science.label": [`Science`, `Естественные`],
        "ui.field.subject.option.science.prompt": [
          `Physics, chemistry, biology reasoning style.`,
          `Стиль рассуждений для физики, химии, биологии.`,
        ],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
