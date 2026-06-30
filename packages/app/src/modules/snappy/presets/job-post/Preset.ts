// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Job posting that attracts the right candidates`, `Вакансия, которая привлекает кандидатов`],
  emoji: `💼`,
  group: `text`,
  title: [`Job post`, `Вакансия`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a job posting — I'll describe the role and company.`, `Нужна вакансия — опишу роль и компанию.`],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `role`,
            kind: `text_input`,
            label: { emoji: `💼`, text: i18n(`ui.field.role.label`) },
            placeholder: i18n(`ui.field.role.placeholder`),
            prompt: i18n(`ui.field.role.prompt`),
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
          `Write a job posting from the role details below following every bullet in the parameter list. Title, about us, responsibilities, requirements, benefits. Output only the posting—no preamble.`,
          `Напиши вакансию из деталей роли ниже, строго следуя каждому пункту списка параметров. Название, о нас, задачи, требования, плюсы. Выведи только вакансию — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.role.label": [`Role details`, `Детали роли`],
        "ui.field.role.placeholder": [`Senior backend, Go, fintech, remote…`, `Senior backend, Go, финтех, удалёнка…`],
        "ui.field.role.prompt": [`Role:`, `Роль:`],
      }),
    }),
  ],
  meta,
};
