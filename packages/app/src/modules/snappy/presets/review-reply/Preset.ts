// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Polite responses to customer reviews`, `Вежливые ответы на отзывы`],
  emoji: `⭐`,
  group: `text`,
  title: [`Review reply`, `Ответ на отзыв`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need to reply to a customer review — I'll paste the review.`,
        `Нужно ответить на отзыв — вставлю текст отзыва.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `review`,
            kind: `text_input`,
            label: { emoji: `⭐`, text: i18n(`ui.field.review.label`) },
            placeholder: i18n(`ui.field.review.placeholder`),
            prompt: i18n(`ui.field.review.prompt`),
          },
          {
            default: `thank`,
            id: `stance`,
            kind: `single_choice`,
            label: { emoji: `💬`, text: i18n(`ui.field.stance.label`) },
            options: [
              {
                label: { emoji: `🙏`, text: i18n(`ui.field.stance.option.thank.label`) },
                prompt: i18n(`ui.field.stance.option.thank.prompt`),
                value: `thank`,
              },
              {
                label: { emoji: `🔧`, text: i18n(`ui.field.stance.option.fix.label`) },
                prompt: i18n(`ui.field.stance.option.fix.prompt`),
                value: `fix`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Draft a public reply to the review below following every bullet in the parameter list. Professional, empathetic, concise. Output only the reply—no preamble.`,
          `Напиши публичный ответ на отзыв ниже, строго следуя каждому пункту списка параметров. Профессионально, с эмпатией, кратко. Выведи только ответ — без вступления.`,
        ],
        "ui.field.review.label": [`Review`, `Отзыв`],
        "ui.field.review.placeholder": [`Paste the customer review…`, `Вставьте отзыв клиента…`],
        "ui.field.review.prompt": [`Review:`, `Отзыв:`],
        "ui.field.stance.label": [`Stance`, `Позиция`],
        "ui.field.stance.option.fix.label": [`Address issue`, `Решить проблему`],
        "ui.field.stance.option.fix.prompt": [
          `Acknowledge issue and offer fix or contact.`,
          `Признай проблему и предложи решение или контакт.`,
        ],
        "ui.field.stance.option.thank.label": [`Thank positive`, `Поблагодарить`],
        "ui.field.stance.option.thank.prompt": [
          `Thank them and reinforce positives.`,
          `Поблагодари и подчеркни плюсы.`,
        ],
      }),
    }),
  ],
  meta,
};
