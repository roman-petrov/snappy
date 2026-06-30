// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Press release structure with quotes and facts`, `Пресс-релиз с фактами и цитатами`],
  emoji: `📢`,
  group: `text`,
  title: [`Press release`, `Пресс-релиз`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a press release — I'll share the news and facts.`,
        `Нужен пресс-релиз — расскажу новость и факты.`,
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
            label: { emoji: `📢`, text: i18n(`ui.field.news.label`) },
            placeholder: i18n(`ui.field.news.placeholder`),
            prompt: i18n(`ui.field.news.prompt`),
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
          `Write a press release from the news below following every bullet in the parameter list. Headline, dateline, lead, body, boilerplate, media contact placeholder. Output only the release—no preamble.`,
          `Напиши пресс-релиз из новости ниже, строго следуя каждому пункту списка параметров. Заголовок, дата, лид, тело, о компании, контакт для СМИ. Выведи только релиз — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.news.label": [`News & facts`, `Новость и факты`],
        "ui.field.news.placeholder": [`Series A funding, $10M, expand EU…`, `Раунд A, $10M, выход в ЕС…`],
        "ui.field.news.prompt": [`News:`, `Новость:`],
      }),
    }),
  ],
  meta,
};
