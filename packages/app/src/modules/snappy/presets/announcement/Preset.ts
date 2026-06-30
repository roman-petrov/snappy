// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Team or customer announcements with clear next steps`, `Объявления для команды или клиентов`],
  emoji: `📣`,
  group: `text`,
  title: [`Announcement`, `Объявление`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need an announcement — I'll describe the news and audience.`,
        `Нужно объявление — опишу новость и аудиторию.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `news`,
            kind: `text_input`,
            label: { emoji: `📣`, text: i18n(`ui.field.news.label`) },
            placeholder: i18n(`ui.field.news.placeholder`),
            prompt: i18n(`ui.field.news.prompt`),
          },
          {
            default: `team`,
            id: `audience`,
            kind: `single_choice`,
            label: { emoji: `👥`, text: i18n(`ui.field.audience.label`) },
            options: [
              {
                label: { emoji: `👥`, text: i18n(`ui.field.audience.option.team.label`) },
                prompt: i18n(`ui.field.audience.option.team.prompt`),
                value: `team`,
              },
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.audience.option.customers.label`) },
                prompt: i18n(`ui.field.audience.option.customers.prompt`),
                value: `customers`,
              },
            ],
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `binary_choice`,
            label: { emoji: `📝`, text: i18n(`ui.field.addFormatting.label`) },
            promptOff: i18n(`ui.field.addFormatting.promptOff`),
            promptOn: i18n(`ui.field.addFormatting.promptOn`),
          },
        ]),
      localization: () => ({
        "prompt": [
          `Write an announcement from the news below following every bullet in the parameter list. Clear headline, what changed, why it matters, next steps. Output only the announcement—no preamble.`,
          `Напиши объявление из новости ниже, строго следуя каждому пункту списка параметров. Заголовок, что изменилось, зачем, следующие шаги. Выведи только объявление — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.audience.label": [`Audience`, `Аудитория`],
        "ui.field.audience.option.customers.label": [`Customers`, `Клиенты`],
        "ui.field.audience.option.customers.prompt": [
          `External, customer-friendly tone.`,
          `Внешний, дружелюбный клиентам тон.`,
        ],
        "ui.field.audience.option.team.label": [`Team`, `Команда`],
        "ui.field.audience.option.team.prompt": [`Internal, direct tone.`, `Внутренний, прямой тон.`],
        "ui.field.news.label": [`News & details`, `Новость и детали`],
        "ui.field.news.placeholder": [`We're launching v2 next Monday…`, `В понедельник запускаем v2…`],
        "ui.field.news.prompt": [`News:`, `Новость:`],
      }),
    }),
  ],
  meta,
};
