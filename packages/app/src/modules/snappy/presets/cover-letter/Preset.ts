// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Tailored cover letter for a role and company`, `Сопроводительное письмо под вакансию`],
  emoji: `✉️`,
  group: `text`,
  title: [`Cover letter`, `Сопроводительное`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a cover letter — I'll share the job and my highlights.`,
        `Нужно сопроводительное — расскажу о вакансии и сильных сторонах.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `job`,
            kind: `text_input`,
            label: { emoji: `💼`, text: i18n(`ui.field.job.label`) },
            placeholder: i18n(`ui.field.job.placeholder`),
            prompt: i18n(`ui.field.job.prompt`),
          },
          {
            id: `highlights`,
            kind: `text_input`,
            label: { emoji: `⭐`, text: i18n(`ui.field.highlights.label`) },
            placeholder: i18n(`ui.field.highlights.placeholder`),
            prompt: i18n(`ui.field.highlights.prompt`),
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
          `Write a cover letter from the job and highlights below following every bullet in the parameter list. Specific, professional, one page max. Output only the letter—no preamble.`,
          `Напиши сопроводительное из вакансии и акцентов ниже, строго следуя каждому пункту списка параметров. Конкретно, профессионально, до одной страницы. Выведи только письмо — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.highlights.label": [`Your highlights`, `Ваши сильные стороны`],
        "ui.field.highlights.placeholder": [
          `Led migration, 40% faster releases…`,
          `Вёл миграцию, релизы на 40% быстрее…`,
        ],
        "ui.field.highlights.prompt": [`Highlights:`, `Сильные стороны:`],
        "ui.field.job.label": [`Job & company`, `Вакансия и компания`],
        "ui.field.job.placeholder": [`Product designer at Acme, B2B SaaS…`, `Product designer в Acme, B2B SaaS…`],
        "ui.field.job.prompt": [`Job:`, `Вакансия:`],
      }),
    }),
  ],
  meta,
};
