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
            default: `google`,
            id: `platform`,
            kind: `single_choice`,
            label: { emoji: `🌐`, text: i18n(`ui.field.platform.label`) },
            options: [
              {
                label: { emoji: `🔍`, text: i18n(`ui.field.platform.option.google.label`) },
                prompt: i18n(`ui.field.platform.option.google.prompt`),
                value: `google`,
              },
              {
                label: { emoji: `📱`, text: i18n(`ui.field.platform.option.appstore.label`) },
                prompt: i18n(`ui.field.platform.option.appstore.prompt`),
                value: `appstore`,
              },
              {
                label: { emoji: `🍽️`, text: i18n(`ui.field.platform.option.yelp.label`) },
                prompt: i18n(`ui.field.platform.option.yelp.prompt`),
                value: `yelp`,
              },
            ],
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
              {
                label: { emoji: `🙇`, text: i18n(`ui.field.stance.option.apologize.label`) },
                prompt: i18n(`ui.field.stance.option.apologize.prompt`),
                value: `apologize`,
              },
              {
                label: { emoji: `📋`, text: i18n(`ui.field.stance.option.explain.label`) },
                prompt: i18n(`ui.field.stance.option.explain.prompt`),
                value: `explain`,
              },
            ],
          },
          {
            default: `warm`,
            id: `tone`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.tone.label`) },
            options: [
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.tone.option.warm.label`) },
                prompt: i18n(`ui.field.tone.option.warm.prompt`),
                value: `warm`,
              },
              {
                label: { emoji: `💼`, text: i18n(`ui.field.tone.option.formal.label`) },
                prompt: i18n(`ui.field.tone.option.formal.prompt`),
                value: `formal`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Draft a public reply to the review below following every bullet in the parameter list. Professional, empathetic, concise. Output only the reply—no preamble.`,
          `Напиши публичный ответ на отзыв ниже, строго следуя каждому пункту списка параметров. Профессионально, с эмпатией, кратко. Выведи только ответ — без вступления.`,
        ],
        "ui.field.platform.label": [`Platform`, `Платформа`],
        "ui.field.platform.option.appstore.label": [`App store`, `App Store`],
        "ui.field.platform.option.appstore.prompt": [
          `Short reply suited to app store reviews; under ~350 characters if possible.`,
          `Короткий ответ под App Store; по возможности до ~350 символов.`,
        ],
        "ui.field.platform.option.google.label": [`Google`, `Google`],
        "ui.field.platform.option.google.prompt": [
          `Google Business style: personal, local business tone; mention owner/manager if natural.`,
          `Стиль Google Business: личный тон локального бизнеса; при уместности — от имени владельца.`,
        ],
        "ui.field.platform.option.yelp.label": [`Yelp`, `Yelp`],
        "ui.field.platform.option.yelp.prompt": [
          `Yelp style: friendly, service-oriented; invite offline resolution for complaints.`,
          `Стиль Yelp: дружелюбно, сервисно; для жалоб — приглашение решить офлайн.`,
        ],
        "ui.field.review.label": [`Review`, `Отзыв`],
        "ui.field.review.placeholder": [`Paste the customer review…`, `Вставьте отзыв клиента…`],
        "ui.field.review.prompt": [`Review:`, `Отзыв:`],
        "ui.field.stance.label": [`Stance`, `Позиция`],
        "ui.field.stance.option.apologize.label": [`Apologize`, `Извиниться`],
        "ui.field.stance.option.apologize.prompt": [
          `Sincere apology without excuses; offer to make it right.`,
          `Искренние извинения без оправданий; предложи исправить ситуацию.`,
        ],
        "ui.field.stance.option.explain.label": [`Explain`, `Объяснить`],
        "ui.field.stance.option.explain.prompt": [
          `Calmly clarify facts or policy; stay respectful, not defensive.`,
          `Спокойно проясни факты или политику; уважительно, без защиты.`,
        ],
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
        "ui.field.tone.label": [`Tone`, `Тон`],
        "ui.field.tone.option.formal.label": [`Formal`, `Формальный`],
        "ui.field.tone.option.formal.prompt": [
          `Polished, corporate tone; no slang or overly casual phrasing.`,
          `Выверенный корпоративный тон; без сленга и панибратства.`,
        ],
        "ui.field.tone.option.warm.label": [`Warm`, `Тёплый`],
        "ui.field.tone.option.warm.prompt": [
          `Friendly and human; show genuine care for the customer.`,
          `Дружелюбно и по-человечески; искренняя забота о клиенте.`,
        ],
      }),
    }),
  ],
  meta,
};
