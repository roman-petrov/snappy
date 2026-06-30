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
            default: `ideas`,
            id: `outputFormat`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.outputFormat.label`) },
            options: [
              {
                label: { emoji: `💡`, text: i18n(`ui.field.outputFormat.option.ideas.label`) },
                prompt: i18n(`ui.field.outputFormat.option.ideas.prompt`),
                value: `ideas`,
              },
              {
                label: { emoji: `⚖️`, text: i18n(`ui.field.outputFormat.option.pros_cons.label`) },
                prompt: i18n(`ui.field.outputFormat.option.pros_cons.prompt`),
                value: `pros_cons`,
              },
              {
                label: { emoji: `✅`, text: i18n(`ui.field.outputFormat.option.actions.label`) },
                prompt: i18n(`ui.field.outputFormat.option.actions.prompt`),
                value: `actions`,
              },
            ],
          },
          {
            default: `10`,
            id: `quantity`,
            kind: `single_choice`,
            label: { emoji: `🔢`, text: i18n(`ui.field.quantity.label`) },
            options: [
              {
                label: { emoji: `5️⃣`, text: i18n(`ui.field.quantity.option.five.label`) },
                prompt: i18n(`ui.field.quantity.option.five.prompt`),
                value: `5`,
              },
              {
                label: { emoji: `🔟`, text: i18n(`ui.field.quantity.option.ten.label`) },
                prompt: i18n(`ui.field.quantity.option.ten.prompt`),
                value: `10`,
              },
              {
                label: { emoji: `2️⃣0️⃣`, text: i18n(`ui.field.quantity.option.twenty.label`) },
                prompt: i18n(`ui.field.quantity.option.twenty.prompt`),
                value: `20`,
              },
            ],
          },
          {
            default: `list`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📑`, text: i18n(`ui.field.format.label`) },
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
        "ui.field.format.label": [`Layout`, `Оформление`],
        "ui.field.format.option.grouped.label": [`Grouped`, `По группам`],
        "ui.field.format.option.grouped.prompt": [
          `Group ideas by theme with short headings.`,
          `Сгруппируй идеи по темам с короткими заголовками.`,
        ],
        "ui.field.format.option.list.label": [`Numbered list`, `Нумерованный список`],
        "ui.field.format.option.list.prompt": [`Numbered list of distinct ideas.`, `Нумерованный список разных идей.`],
        "ui.field.outputFormat.label": [`Output type`, `Тип результата`],
        "ui.field.outputFormat.option.actions.label": [`Action items`, `Действия`],
        "ui.field.outputFormat.option.actions.prompt": [
          `Concrete next steps or action items, not just ideas.`,
          `Конкретные следующие шаги или action items, не только идеи.`,
        ],
        "ui.field.outputFormat.option.ideas.label": [`Ideas`, `Идеи`],
        "ui.field.outputFormat.option.ideas.prompt": [
          `Creative ideas and concepts; diverse angles.`,
          `Креативные идеи и концепции; разные углы.`,
        ],
        "ui.field.outputFormat.option.pros_cons.label": [`Pros & cons`, `Плюсы и минусы`],
        "ui.field.outputFormat.option.pros_cons.prompt": [
          `For each idea: brief pros and cons.`,
          `К каждой идее — кратко плюсы и минусы.`,
        ],
        "ui.field.quantity.label": [`How many`, `Сколько`],
        "ui.field.quantity.option.five.label": [`5`, `5`],
        "ui.field.quantity.option.five.prompt": [`About five items.`, `Около пяти пунктов.`],
        "ui.field.quantity.option.ten.label": [`10`, `10`],
        "ui.field.quantity.option.ten.prompt": [`About ten items.`, `Около десяти пунктов.`],
        "ui.field.quantity.option.twenty.label": [`20`, `20`],
        "ui.field.quantity.option.twenty.prompt": [`About twenty items.`, `Около двадцати пунктов.`],
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
