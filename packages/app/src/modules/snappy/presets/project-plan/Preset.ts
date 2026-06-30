// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Milestones, tasks, and owners for a project`, `Вехи, задачи и ответственные`],
  emoji: `🗂️`,
  group: `plan`,
  title: [`Project plan`, `План проекта`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a project plan — I'll describe scope and deadline.`, `Нужен план проекта — опишу объём и срок.`],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `scope`,
            kind: `text_input`,
            label: { emoji: `🗂️`, text: i18n(`ui.field.scope.label`) },
            placeholder: i18n(`ui.field.scope.placeholder`),
            prompt: i18n(`ui.field.scope.prompt`),
          },
          {
            id: `deadline`,
            kind: `text_input`,
            label: { emoji: `📅`, text: i18n(`ui.field.deadline.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.deadline.placeholder`),
            prompt: i18n(`ui.field.deadline.prompt`),
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
          `Create a project plan from the scope below following every bullet in the parameter list. Phases, milestones, tasks, dependencies, and risks. Output only the plan—no preamble.`,
          `Составь план проекта из объёма ниже, строго следуя каждому пункту списка параметров. Фазы, вехи, задачи, зависимости и риски. Выведи только план — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.deadline.label": [`Deadline (optional)`, `Срок (необязательно)`],
        "ui.field.deadline.placeholder": [`6 weeks, Q3 launch…`, `6 недель, запуск в Q3…`],
        "ui.field.deadline.prompt": [`Deadline:`, `Срок:`],
        "ui.field.scope.label": [`Scope`, `Объём`],
        "ui.field.scope.placeholder": [
          `MVP mobile app with auth and feed…`,
          `MVP мобильного приложения с авторизацией и лентой…`,
        ],
        "ui.field.scope.prompt": [`Scope:`, `Объём:`],
      }),
    }),
  ],
  meta,
};
