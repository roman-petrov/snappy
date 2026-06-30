// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Priorities and time blocks for the week ahead`, `Приоритеты и блоки времени на неделю`],
  emoji: `🗓️`,
  group: `plan`,
  title: [`Weekly plan`, `План на неделю`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a plan for the week — I'll list goals and commitments.`,
        `Нужен план на неделю — перечислю цели и обязательства.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `priorities`,
            kind: `text_input`,
            label: { emoji: `🎯`, text: i18n(`ui.field.priorities.label`) },
            placeholder: i18n(`ui.field.priorities.placeholder`),
            prompt: i18n(`ui.field.priorities.prompt`),
          },
          {
            id: `constraints`,
            kind: `text_input`,
            label: { emoji: `📏`, text: i18n(`ui.field.constraints.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.constraints.placeholder`),
            prompt: i18n(`ui.field.constraints.prompt`),
          },
          {
            default: `top3`,
            id: `priorityMethod`,
            kind: `single_choice`,
            label: { emoji: `🔢`, text: i18n(`ui.field.priorityMethod.label`) },
            options: [
              {
                label: { emoji: `3️⃣`, text: i18n(`ui.field.priorityMethod.option.top3.label`) },
                prompt: i18n(`ui.field.priorityMethod.option.top3.prompt`),
                value: `top3`,
              },
              {
                label: { emoji: `🅰️`, text: i18n(`ui.field.priorityMethod.option.abc.label`) },
                prompt: i18n(`ui.field.priorityMethod.option.abc.prompt`),
                value: `abc`,
              },
              {
                label: { emoji: `⚡`, text: i18n(`ui.field.priorityMethod.option.energy.label`) },
                prompt: i18n(`ui.field.priorityMethod.option.energy.prompt`),
                value: `energy`,
              },
            ],
          },
          {
            default: `blocks`,
            id: `timeBlocks`,
            kind: `single_choice`,
            label: { emoji: `⏰`, text: i18n(`ui.field.timeBlocks.label`) },
            options: [
              {
                label: { emoji: `🧱`, text: i18n(`ui.field.timeBlocks.option.blocks.label`) },
                prompt: i18n(`ui.field.timeBlocks.option.blocks.prompt`),
                value: `blocks`,
              },
              {
                label: { emoji: `📋`, text: i18n(`ui.field.timeBlocks.option.tasks.label`) },
                prompt: i18n(`ui.field.timeBlocks.option.tasks.prompt`),
                value: `tasks`,
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
          `Create a weekly plan from the priorities below following every bullet in the parameter list. Top 3 goals, day-by-day outline, and buffer time. Output only the plan—no preamble.`,
          `Составь план на неделю из приоритетов ниже, строго следуя каждому пункту списка параметров. Топ-3 цели, план по дням и буфер. Выведи только план — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.constraints.label": [`Fixed commitments (optional)`, `Фиксированное (необязательно)`],
        "ui.field.constraints.placeholder": [`Meetings Tue/Thu, gym Mon/Wed…`, `Встречи вт/чт, спорт пн/ср…`],
        "ui.field.constraints.prompt": [`Commitments:`, `Обязательства:`],
        "ui.field.priorities.label": [`Priorities`, `Приоритеты`],
        "ui.field.priorities.placeholder": [
          `Ship feature X, write blog post, exercise 3x…`,
          `Выпустить фичу X, пост в блог, спорт 3 раза…`,
        ],
        "ui.field.priorities.prompt": [`Priorities:`, `Приоритеты:`],
        "ui.field.priorityMethod.label": [`Priorities`, `Приоритизация`],
        "ui.field.priorityMethod.option.abc.label": [`A/B/C`, `A/B/C`],
        "ui.field.priorityMethod.option.abc.prompt": [
          `Label tasks A (must), B (should), C (nice).`,
          `Метки A (must), B (should), C (nice).`,
        ],
        "ui.field.priorityMethod.option.energy.label": [`By energy`, `По энергии`],
        "ui.field.priorityMethod.option.energy.prompt": [
          `Match hard tasks to peak energy slots.`,
          `Сложные задачи — на пик энергии.`,
        ],
        "ui.field.priorityMethod.option.top3.label": [`Top 3`, `Топ-3`],
        "ui.field.priorityMethod.option.top3.prompt": [
          `Pick three must-win outcomes for the week.`,
          `Три must-win результата на неделю.`,
        ],
        "ui.field.timeBlocks.label": [`Schedule style`, `Стиль расписания`],
        "ui.field.timeBlocks.option.blocks.label": [`Time blocks`, `Блоки времени`],
        "ui.field.timeBlocks.option.blocks.prompt": [
          `Day-by-day with morning/afternoon/evening blocks.`,
          `По дням с блоками утро/день/вечер.`,
        ],
        "ui.field.timeBlocks.option.tasks.label": [`Task list`, `Список задач`],
        "ui.field.timeBlocks.option.tasks.prompt": [
          `Prioritized task list per day without fixed hours.`,
          `Приоритетный список задач по дням без жёстких часов.`,
        ],
      }),
    }),
  ],
  meta,
};
