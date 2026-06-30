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
            default: `product`,
            id: `announcementType`,
            kind: `single_choice`,
            label: { emoji: `🏷️`, text: i18n(`ui.field.announcementType.label`) },
            options: [
              {
                label: { emoji: `📦`, text: i18n(`ui.field.announcementType.option.product.label`) },
                prompt: i18n(`ui.field.announcementType.option.product.prompt`),
                value: `product`,
              },
              {
                label: { emoji: `💰`, text: i18n(`ui.field.announcementType.option.funding.label`) },
                prompt: i18n(`ui.field.announcementType.option.funding.prompt`),
                value: `funding`,
              },
              {
                label: { emoji: `👤`, text: i18n(`ui.field.announcementType.option.hire.label`) },
                prompt: i18n(`ui.field.announcementType.option.hire.prompt`),
                value: `hire`,
              },
              {
                label: { emoji: `🎉`, text: i18n(`ui.field.announcementType.option.event.label`) },
                prompt: i18n(`ui.field.announcementType.option.event.prompt`),
                value: `event`,
              },
            ],
          },
          {
            default: `professional`,
            id: `tone`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.tone.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.tone.option.professional.label`) },
                prompt: i18n(`ui.field.tone.option.professional.prompt`),
                value: `professional`,
              },
              {
                label: { emoji: `🚀`, text: i18n(`ui.field.tone.option.energetic.label`) },
                prompt: i18n(`ui.field.tone.option.energetic.prompt`),
                value: `energetic`,
              },
            ],
          },
          {
            default: false,
            id: `includeQuote`,
            kind: `binary_choice`,
            label: { emoji: `💬`, text: i18n(`ui.field.includeQuote.label`) },
            promptOff: i18n(`ui.field.includeQuote.promptOff`),
            promptOn: i18n(`ui.field.includeQuote.promptOn`),
          },
          {
            id: `companyInfo`,
            kind: `text_input`,
            label: { emoji: `🏢`, text: i18n(`ui.field.companyInfo.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.companyInfo.placeholder`),
            prompt: i18n(`ui.field.companyInfo.prompt`),
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
        "ui.field.announcementType.label": [`Type`, `Тип`],
        "ui.field.announcementType.option.event.label": [`Event`, `Событие`],
        "ui.field.announcementType.option.event.prompt": [
          `Frame as event or milestone announcement; highlight date and significance.`,
          `Подай как событие или milestone; выдели дату и значимость.`,
        ],
        "ui.field.announcementType.option.funding.label": [`Funding`, `Инвестиции`],
        "ui.field.announcementType.option.funding.prompt": [
          `Lead with funding round, amount, investors, and use of funds.`,
          `В лиде — раунд, сумма, инвесторы и использование средств.`,
        ],
        "ui.field.announcementType.option.hire.label": [`Hire`, `Назначение`],
        "ui.field.announcementType.option.hire.prompt": [
          `Lead with executive hire or key appointment; include background.`,
          `В лиде — ключевое назначение; кратко — бэкграунд человека.`,
        ],
        "ui.field.announcementType.option.product.label": [`Product`, `Продукт`],
        "ui.field.announcementType.option.product.prompt": [
          `Lead with product launch or feature; benefits and availability.`,
          `В лиде — запуск или фича; польза и доступность.`,
        ],
        "ui.field.companyInfo.label": [`About company`, `О компании`],
        "ui.field.companyInfo.placeholder": [
          `Acme Corp, B2B SaaS, founded 2020…`,
          `Acme Corp, B2B SaaS, основана 2020…`,
        ],
        "ui.field.companyInfo.prompt": [`Company boilerplate:`, `О компании:`],
        "ui.field.includeQuote.label": [`Quote`, `Цитата`],
        "ui.field.includeQuote.promptOff": [`No executive quote.`, `Без цитаты руководителя.`],
        "ui.field.includeQuote.promptOn": [
          `Include a placeholder executive quote in the body.`,
          `Добавь placeholder-цитату руководителя в текст.`,
        ],
        "ui.field.news.label": [`News & facts`, `Новость и факты`],
        "ui.field.news.placeholder": [`Series A funding, $10M, expand EU…`, `Раунд A, $10M, выход в ЕС…`],
        "ui.field.news.prompt": [`News:`, `Новость:`],
        "ui.field.tone.label": [`Tone`, `Тон`],
        "ui.field.tone.option.energetic.label": [`Energetic`, `Энергичный`],
        "ui.field.tone.option.energetic.prompt": [
          `Upbeat, forward-looking; still factual and professional.`,
          `Оптимистичный, про будущее; факты и профессионализм сохраняются.`,
        ],
        "ui.field.tone.option.professional.label": [`Professional`, `Деловой`],
        "ui.field.tone.option.professional.prompt": [
          `Standard PR tone: neutral, authoritative, third-person.`,
          `Стандартный PR-тон: нейтрально, авторитетно, от третьего лица.`,
        ],
      }),
    }),
  ],
  meta,
};
