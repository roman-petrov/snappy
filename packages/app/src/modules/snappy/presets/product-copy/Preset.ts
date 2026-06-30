// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Marketing copy for a product or feature`, `Маркетинговый текст о продукте`],
  emoji: `🛍️`,
  group: `text`,
  title: [`Product copy`, `Текст о продукте`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need product marketing copy — I'll describe the product.`,
        `Нужен маркетинговый текст — опишу продукт.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `product`,
            kind: `text_input`,
            label: { emoji: `🛍️`, text: i18n(`ui.field.product.label`) },
            placeholder: i18n(`ui.field.product.placeholder`),
            prompt: i18n(`ui.field.product.prompt`),
          },
          {
            default: `landing`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📄`, text: i18n(`ui.field.format.label`) },
            options: [
              {
                label: { emoji: `🌐`, text: i18n(`ui.field.format.option.landing.label`) },
                prompt: i18n(`ui.field.format.option.landing.prompt`),
                value: `landing`,
              },
              {
                label: { emoji: `📱`, text: i18n(`ui.field.format.option.appstore.label`) },
                prompt: i18n(`ui.field.format.option.appstore.prompt`),
                value: `appstore`,
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
          `Write product copy from the product description below following every bullet in the parameter list. Output only the copy—no preamble.`,
          `Напиши текст о продукте из описания ниже, строго следуя каждому пункту списка параметров. Выведи только текст — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.format.label": [`Format`, `Формат`],
        "ui.field.format.option.appstore.label": [`App store`, `Стор`],
        "ui.field.format.option.appstore.prompt": [
          `Short description + feature bullets for store listing.`,
          `Краткое описание + буллеты для стора.`,
        ],
        "ui.field.format.option.landing.label": [`Landing page`, `Лендинг`],
        "ui.field.format.option.landing.prompt": [`Hero, benefits, CTA sections.`, `Hero, преимущества, блок CTA.`],
        "ui.field.product.label": [`Product`, `Продукт`],
        "ui.field.product.placeholder": [
          `AI note app for teams, real-time sync…`,
          `AI-заметки для команд, синхронизация…`,
        ],
        "ui.field.product.prompt": [`Product:`, `Продукт:`],
      }),
    }),
  ],
  meta,
};
