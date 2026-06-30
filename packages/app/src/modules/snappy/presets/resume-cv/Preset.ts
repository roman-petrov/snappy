// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Polished resume or CV from your experience`, `Резюме из вашего опыта`],
  emoji: `👔`,
  group: `text`,
  title: [`Resume / CV`, `Резюме`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a resume — I'll paste my experience and target role.`,
        `Нужно резюме — вставлю опыт и целевую роль.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `experience`,
            kind: `text_input`,
            label: { emoji: `📄`, text: i18n(`ui.field.experience.label`) },
            placeholder: i18n(`ui.field.experience.placeholder`),
            prompt: i18n(`ui.field.experience.prompt`),
          },
          {
            id: `target`,
            kind: `text_input`,
            label: { emoji: `🎯`, text: i18n(`ui.field.target.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.target.placeholder`),
            prompt: i18n(`ui.field.target.prompt`),
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
          `Create a resume/CV from the experience below following every bullet in the parameter list. Tailor to target role if given. Output only the resume—no preamble.`,
          `Составь резюме из опыта ниже, строго следуя каждому пункту списка параметров. Подстрой под целевую роль, если указана. Выведи только резюме — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.experience.label": [`Experience`, `Опыт`],
        "ui.field.experience.placeholder": [
          `Jobs, skills, education, achievements…`,
          `Работа, навыки, образование, достижения…`,
        ],
        "ui.field.experience.prompt": [`Experience:`, `Опыт:`],
        "ui.field.target.label": [`Target role (optional)`, `Целевая роль (необязательно)`],
        "ui.field.target.placeholder": [`Senior product manager…`, `Senior product manager…`],
        "ui.field.target.prompt": [`Target role:`, `Целевая роль:`],
      }),
    }),
  ],
  meta,
};
