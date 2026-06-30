// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Actionable checklist from goals or tasks`, `Чеклист задач из целей`],
  emoji: `✅`,
  group: `plan`,
  title: [`Checklist`, `Чеклист`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a checklist — I'll describe what needs to get done.`,
        `Нужен чеклист — опишу, что нужно сделать.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `goal`,
            kind: `text_input`,
            label: { emoji: `🎯`, text: i18n(`ui.field.goal.label`) },
            placeholder: i18n(`ui.field.goal.placeholder`),
            prompt: i18n(`ui.field.goal.prompt`),
          },
          {
            default: `medium`,
            id: `granularity`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.granularity.label`) },
            options: [
              {
                label: { emoji: `🔍`, text: i18n(`ui.field.granularity.option.fine.label`) },
                prompt: i18n(`ui.field.granularity.option.fine.prompt`),
                value: `fine`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.granularity.option.medium.label`) },
                prompt: i18n(`ui.field.granularity.option.medium.prompt`),
                value: `medium`,
              },
              {
                label: { emoji: `🦅`, text: i18n(`ui.field.granularity.option.coarse.label`) },
                prompt: i18n(`ui.field.granularity.option.coarse.prompt`),
                value: `coarse`,
              },
            ],
          },
          {
            default: false,
            id: `markPriority`,
            kind: `binary_choice`,
            label: { emoji: `🔥`, text: i18n(`ui.field.markPriority.label`) },
            promptOff: i18n(`ui.field.markPriority.promptOff`),
            promptOn: i18n(`ui.field.markPriority.promptOn`),
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
          `Create a practical checklist for the goal under "Goal" below following every bullet in the parameter list. Use checkbox markdown (- [ ]). Output only the checklist—no preamble.`,
          `Составь практичный чеклист для цели под меткой «Цель» ниже, строго следуя каждому пункту списка параметров. Чекбоксы markdown (- [ ]). Выведи только чеклист — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.goal.label": [`Goal`, `Цель`],
        "ui.field.goal.placeholder": [`Launch a small online course…`, `Запустить небольшой онлайн-курс…`],
        "ui.field.goal.prompt": [`Goal:`, `Цель:`],
        "ui.field.granularity.label": [`Detail level`, `Детализация`],
        "ui.field.granularity.option.coarse.label": [`High-level`, `Крупно`],
        "ui.field.granularity.option.coarse.prompt": [`~5–8 major steps only.`, `Только 5–8 крупных шагов.`],
        "ui.field.granularity.option.fine.label": [`Detailed`, `Подробно`],
        "ui.field.granularity.option.fine.prompt": [`Many small actionable steps.`, `Много мелких конкретных шагов.`],
        "ui.field.granularity.option.medium.label": [`Balanced`, `Сбалансированно`],
        "ui.field.granularity.option.medium.prompt": [
          `Clear steps without micro-tasks.`,
          `Понятные шаги без микрозадач.`,
        ],
        "ui.field.markPriority.label": [`Priority marks`, `Приоритеты`],
        "ui.field.markPriority.promptOff": [
          `Flat list; no priority labels.`,
          `Плоский список; без меток приоритета.`,
        ],
        "ui.field.markPriority.promptOn": [
          `Mark critical items with 🔥 or [high] prefix.`,
          `Отметь критичные пункты префиксом 🔥 или [high].`,
        ],
      }),
    }),
  ],
  meta,
};
