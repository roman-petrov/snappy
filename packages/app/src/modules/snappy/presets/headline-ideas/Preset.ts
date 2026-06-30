// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Catchy headlines for articles, ads, or posts`, `Цепляющие заголовки`],
  emoji: `📰`,
  group: `text`,
  title: [`Headline ideas`, `Заголовки`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need headline options — I'll describe the content.`, `Нужны варианты заголовков — опишу материал.`],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `topic`,
            kind: `text_input`,
            label: { emoji: `📰`, text: i18n(`ui.field.topic.label`) },
            placeholder: i18n(`ui.field.topic.placeholder`),
            prompt: i18n(`ui.field.topic.prompt`),
          },
          {
            default: `informative`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `📖`, text: i18n(`ui.field.style.option.informative.label`) },
                prompt: i18n(`ui.field.style.option.informative.prompt`),
                value: `informative`,
              },
              {
                label: { emoji: `🔍`, text: i18n(`ui.field.style.option.seo.label`) },
                prompt: i18n(`ui.field.style.option.seo.prompt`),
                value: `seo`,
              },
              {
                label: { emoji: `⚡`, text: i18n(`ui.field.style.option.punchy.label`) },
                prompt: i18n(`ui.field.style.option.punchy.prompt`),
                value: `punchy`,
              },
            ],
          },
          {
            default: `5`,
            id: `count`,
            kind: `single_choice`,
            label: { emoji: `🔢`, text: i18n(`ui.field.count.label`) },
            options: [
              {
                label: { emoji: `3️⃣`, text: i18n(`ui.field.count.option.three.label`) },
                prompt: i18n(`ui.field.count.option.three.prompt`),
                value: `3`,
              },
              {
                label: { emoji: `5️⃣`, text: i18n(`ui.field.count.option.five.label`) },
                prompt: i18n(`ui.field.count.option.five.prompt`),
                value: `5`,
              },
              {
                label: { emoji: `🔟`, text: i18n(`ui.field.count.option.ten.label`) },
                prompt: i18n(`ui.field.count.option.ten.prompt`),
                value: `10`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Generate headline ideas for the topic below following every bullet in the parameter list. Varied angles; no clickbait lies. Output only the headlines—no preamble.`,
          `Придумай заголовки по теме ниже, строго следуя каждому пункту списка параметров. Разные углы; без ложного кликбейта. Выведи только заголовки — без вступления.`,
        ],
        "ui.field.count.label": [`How many`, `Сколько`],
        "ui.field.count.option.five.label": [`5 ideas`, `5 идей`],
        "ui.field.count.option.five.prompt": [`Five distinct headlines.`, `Пять разных заголовков.`],
        "ui.field.count.option.ten.label": [`10 ideas`, `10 идей`],
        "ui.field.count.option.ten.prompt": [`Ten distinct headlines.`, `Десять разных заголовков.`],
        "ui.field.count.option.three.label": [`3 ideas`, `3 идеи`],
        "ui.field.count.option.three.prompt": [`Three distinct headlines.`, `Три разных заголовка.`],
        "ui.field.style.label": [`Style`, `Стиль`],
        "ui.field.style.option.informative.label": [`Informative`, `Информативный`],
        "ui.field.style.option.informative.prompt": [
          `Clear, accurate headlines that set expectations; no hype.`,
          `Ясные, точные заголовки без хайпа; читатель понимает, о чём материал.`,
        ],
        "ui.field.style.option.punchy.label": [`Punchy`, `Цепляющий`],
        "ui.field.style.option.punchy.prompt": [
          `Short, energetic headlines with strong verbs; still honest.`,
          `Короткие, энергичные заголовки с сильными глаголами; без обмана.`,
        ],
        "ui.field.style.option.seo.label": [`SEO`, `SEO`],
        "ui.field.style.option.seo.prompt": [
          `Include likely search keywords naturally; readable for humans first.`,
          `Включи вероятные ключевые слова естественно; сначала читаемость для людей.`,
        ],
        "ui.field.topic.label": [`Topic & angle`, `Тема и угол`],
        "ui.field.topic.placeholder": [`Guide to remote work for engineers…`, `Гайд по удалёнке для инженеров…`],
        "ui.field.topic.prompt": [`Topic:`, `Тема:`],
      }),
    }),
  ],
  meta,
};
