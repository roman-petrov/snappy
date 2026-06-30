// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Compare options with pros, cons, and a recommendation`, `Сравнение вариантов с выводом`],
  emoji: `⚖️`,
  group: `plan`,
  title: [`Decision help`, `Помощь с выбором`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I'm choosing between options — I'll describe the decision.`,
        `Выбираю между вариантами — опишу решение.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `decision`,
            kind: `text_input`,
            label: { emoji: `⚖️`, text: i18n(`ui.field.decision.label`) },
            placeholder: i18n(`ui.field.decision.placeholder`),
            prompt: i18n(`ui.field.decision.prompt`),
          },
          {
            id: `options`,
            kind: `text_input`,
            label: { emoji: `🔀`, text: i18n(`ui.field.options.label`) },
            placeholder: i18n(`ui.field.options.placeholder`),
            prompt: i18n(`ui.field.options.prompt`),
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
          `Help decide using the decision context and options below following every bullet in the parameter list. For each option: pros, cons, risks. End with a clear recommendation and caveats. Output only the analysis—no preamble.`,
          `Помоги выбрать, используя контекст и варианты ниже, строго следуя каждому пункту списка параметров. По каждому варианту: плюсы, минусы, риски. В конце — рекомендация и оговорки. Выведи только анализ — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.decision.label": [`Decision context`, `Контекст решения`],
        "ui.field.decision.placeholder": [
          `Pick a stack for a new mobile app…`,
          `Выбрать стек для нового мобильного приложения…`,
        ],
        "ui.field.decision.prompt": [`Context:`, `Контекст:`],
        "ui.field.options.label": [`Options`, `Варианты`],
        "ui.field.options.placeholder": [`Flutter vs React Native vs native…`, `Flutter vs React Native vs натив…`],
        "ui.field.options.prompt": [`Options:`, `Варианты:`],
      }),
    }),
  ],
  meta,
};
