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
            default: `agile`,
            id: `methodology`,
            kind: `single_choice`,
            label: { emoji: `🔄`, text: i18n(`ui.field.methodology.label`) },
            options: [
              {
                label: { emoji: `🏃`, text: i18n(`ui.field.methodology.option.agile.label`) },
                prompt: i18n(`ui.field.methodology.option.agile.prompt`),
                value: `agile`,
              },
              {
                label: { emoji: `📊`, text: i18n(`ui.field.methodology.option.waterfall.label`) },
                prompt: i18n(`ui.field.methodology.option.waterfall.prompt`),
                value: `waterfall`,
              },
              {
                label: { emoji: `📋`, text: i18n(`ui.field.methodology.option.kanban.label`) },
                prompt: i18n(`ui.field.methodology.option.kanban.prompt`),
                value: `kanban`,
              },
            ],
          },
          {
            default: `standard`,
            id: `detailLevel`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.detailLevel.label`) },
            options: [
              {
                label: { emoji: `🦅`, text: i18n(`ui.field.detailLevel.option.high.label`) },
                prompt: i18n(`ui.field.detailLevel.option.high.prompt`),
                value: `high`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.detailLevel.option.standard.label`) },
                prompt: i18n(`ui.field.detailLevel.option.standard.prompt`),
                value: `standard`,
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
          `Create a project plan from the scope below following every bullet in the parameter list. Phases, milestones, tasks, dependencies, and risks. Output only the plan—no preamble.`,
          `Составь план проекта из объёма ниже, строго следуя каждому пункту списка параметров. Фазы, вехи, задачи, зависимости и риски. Выведи только план — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.deadline.label": [`Deadline (optional)`, `Срок (необязательно)`],
        "ui.field.deadline.placeholder": [`6 weeks, Q3 launch…`, `6 недель, запуск в Q3…`],
        "ui.field.deadline.prompt": [`Deadline:`, `Срок:`],
        "ui.field.detailLevel.label": [`Detail`, `Детализация`],
        "ui.field.detailLevel.option.high.label": [`High-level`, `Крупно`],
        "ui.field.detailLevel.option.high.prompt": [
          `Phases and milestones only; no task breakdown.`,
          `Только фазы и вехи; без декомпозиции задач.`,
        ],
        "ui.field.detailLevel.option.standard.label": [`Standard`, `Стандарт`],
        "ui.field.detailLevel.option.standard.prompt": [
          `Phases, milestones, and key tasks with owners.`,
          `Фазы, вехи и ключевые задачи с ответственными.`,
        ],
        "ui.field.methodology.label": [`Methodology`, `Методология`],
        "ui.field.methodology.option.agile.label": [`Agile`, `Agile`],
        "ui.field.methodology.option.agile.prompt": [
          `Sprints, iterations, backlog-style phases.`,
          `Спринты, итерации, фазы в стиле backlog.`,
        ],
        "ui.field.methodology.option.kanban.label": [`Kanban`, `Kanban`],
        "ui.field.methodology.option.kanban.prompt": [
          `Flow-based stages; WIP limits where relevant.`,
          `Потоковые стадии; WIP-лимиты где уместно.`,
        ],
        "ui.field.methodology.option.waterfall.label": [`Waterfall`, `Waterfall`],
        "ui.field.methodology.option.waterfall.prompt": [
          `Sequential phases with gates and deliverables.`,
          `Последовательные фазы с gate и deliverables.`,
        ],
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
