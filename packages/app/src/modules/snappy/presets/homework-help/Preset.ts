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
            id: `subject`,
            kind: `text_input`,
            label: { emoji: `📖`, text: i18n(`ui.field.subject.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.subject.placeholder`),
            prompt: i18n(`ui.field.subject.prompt`),
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
        "ui.field.subject.label": [`Subject (optional)`, `Предмет (необязательно)`],
        "ui.field.subject.placeholder": [`Algebra, physics, history…`, `Алгебра, физика, история…`],
        "ui.field.subject.prompt": [`Subject or topic:`, `Предмет или тема:`],
      }),
      resolve: ({ answers: { image } }) => image,
    }),
  ],
  meta,
};
