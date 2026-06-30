// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Structured ideation with diverse options`, `Структурированный поиск идей`],
  emoji: `💡`,
  group: `plan`,
  title: [`Brainstorm`, `Мозговой штурм`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need creative ideas — I'll describe the topic and constraints.`,
        `Нужны идеи — опишу тему и ограничения.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `topic`,
            kind: `text_input`,
            label: { emoji: `💡`, text: i18n(`ui.field.topic.label`) },
            placeholder: i18n(`ui.field.topic.placeholder`),
            prompt: i18n(`ui.field.topic.prompt`),
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
            default: `list`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.format.label`) },
            options: [
              {
                label: { emoji: `📋`, text: i18n(`ui.field.format.option.list.label`) },
                prompt: i18n(`ui.field.format.option.list.prompt`),
                value: `list`,
              },
              {
                label: { emoji: `🗂️`, text: i18n(`ui.field.format.option.grouped.label`) },
                prompt: i18n(`ui.field.format.option.grouped.prompt`),
                value: `grouped`,
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
          `Brainstorm ideas for the topic under "Topic" below following every bullet in the parameter list. Be diverse; avoid repeating near-duplicates. Output only the ideas—no preamble.`,
          `Придумай идеи по теме под меткой «Тема» ниже, строго следуя каждому пункту списка параметров. Разнообразие; без почти одинаковых повторов. Выведи только идеи — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.constraints.label": [`Constraints (optional)`, `Ограничения (необязательно)`],
        "ui.field.constraints.placeholder": [`Budget, timeline, audience…`, `Бюджет, сроки, аудитория…`],
        "ui.field.constraints.prompt": [`Constraints:`, `Ограничения:`],
        "ui.field.format.label": [`Output format`, `Формат`],
        "ui.field.format.option.grouped.label": [`Grouped`, `По группам`],
        "ui.field.format.option.grouped.prompt": [
          `Group ideas by theme with short headings.`,
          `Сгруппируй идеи по темам с короткими заголовками.`,
        ],
        "ui.field.format.option.list.label": [`Numbered list`, `Нумерованный список`],
        "ui.field.format.option.list.prompt": [`Numbered list of distinct ideas.`, `Нумерованный список разных идей.`],
        "ui.field.topic.label": [`Topic`, `Тема`],
        "ui.field.topic.placeholder": [
          `Ways to onboard new users to our app…`,
          `Как онбордить новых пользователей в приложение…`,
        ],
        "ui.field.topic.prompt": [`Topic:`, `Тема:`],
      }),
    }),
  ],
  meta,
};
