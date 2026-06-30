// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Professional email draft for any situation`, `Черновик письма под ситуацию`],
  emoji: `📧`,
  group: `text`,
  title: [`Email draft`, `Черновик письма`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need to write an email — I'll describe the situation.`, `Нужно написать письмо — опишу ситуацию.`],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `situation`,
            kind: `text_input`,
            label: { emoji: `📧`, text: i18n(`ui.field.situation.label`) },
            placeholder: i18n(`ui.field.situation.placeholder`),
            prompt: i18n(`ui.field.situation.prompt`),
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
                label: { emoji: `🤝`, text: i18n(`ui.field.tone.option.friendly.label`) },
                prompt: i18n(`ui.field.tone.option.friendly.prompt`),
                value: `friendly`,
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
          `Draft an email from the situation below following every bullet in the parameter list. Subject line + body. Output only the email—no preamble.`,
          `Напиши черновик письма из ситуации ниже, строго следуя каждому пункту списка параметров. Тема + тело. Выведи только письмо — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.situation.label": [`Situation`, `Ситуация`],
        "ui.field.situation.placeholder": [
          `Follow up after demo, propose next steps…`,
          `Фоллоу-ап после демо, предложить шаги…`,
        ],
        "ui.field.situation.prompt": [`Situation:`, `Ситуация:`],
        "ui.field.tone.label": [`Tone`, `Тон`],
        "ui.field.tone.option.friendly.label": [`Friendly`, `Дружелюбный`],
        "ui.field.tone.option.friendly.prompt": [`Warm but still professional.`, `Тёплый, но деловой.`],
        "ui.field.tone.option.professional.label": [`Professional`, `Деловой`],
        "ui.field.tone.option.professional.prompt": [`Formal business tone.`, `Формальный деловой тон.`],
      }),
    }),
  ],
  meta,
};
