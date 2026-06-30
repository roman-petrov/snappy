// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`FAQ entries from product or policy notes`, `Вопросы и ответы из заметок`],
  emoji: `❓`,
  group: `text`,
  title: [`FAQ draft`, `Черновик FAQ`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need FAQ content — I'll describe the product or topic.`, `Нужен FAQ — опишу продукт или тему.`],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `topic`,
            kind: `text_input`,
            label: { emoji: `❓`, text: i18n(`ui.field.topic.label`) },
            placeholder: i18n(`ui.field.topic.placeholder`),
            prompt: i18n(`ui.field.topic.prompt`),
          },
          {
            default: `8`,
            id: `count`,
            kind: `single_choice`,
            label: { emoji: `🔢`, text: i18n(`ui.field.count.label`) },
            options: [
              {
                label: { emoji: `5️⃣`, text: i18n(`ui.field.count.option.five.label`) },
                prompt: i18n(`ui.field.count.option.five.prompt`),
                value: `5`,
              },
              {
                label: { emoji: `8️⃣`, text: i18n(`ui.field.count.option.eight.label`) },
                prompt: i18n(`ui.field.count.option.eight.prompt`),
                value: `8`,
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
          `Create FAQ Q&A from the topic below following every bullet in the parameter list. Clear questions users would ask; concise answers. Output only the FAQ—no preamble.`,
          `Составь FAQ из темы ниже, строго следуя каждому пункту списка параметров. Понятные вопросы пользователей; краткие ответы. Выведи только FAQ — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.count.label": [`Number of Q&As`, `Количество пар`],
        "ui.field.count.option.eight.label": [`About 8`, `Около 8`],
        "ui.field.count.option.eight.prompt": [`Roughly eight Q&A pairs.`, `Примерно восемь пар вопрос-ответ.`],
        "ui.field.count.option.five.label": [`About 5`, `Около 5`],
        "ui.field.count.option.five.prompt": [`Roughly five Q&A pairs.`, `Примерно пять пар вопрос-ответ.`],
        "ui.field.topic.label": [`Product or topic`, `Продукт или тема`],
        "ui.field.topic.placeholder": [`SaaS billing, refunds, trials…`, `Биллинг SaaS, возвраты, триалы…`],
        "ui.field.topic.prompt": [`Topic:`, `Тема:`],
      }),
    }),
  ],
  meta,
};
