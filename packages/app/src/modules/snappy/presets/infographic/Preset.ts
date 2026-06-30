// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Informative visuals with labels and hierarchy`, `Наглядная инфографика с акцентами`],
  emoji: `📈`,
  group: `visual`,
  title: [`Infographic`, `Инфографика`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need an infographic image.`, `Нужна инфографика.`],
      skill: `visual-diagram-generation`,
      tools: [`ask`, `date-time`, `look-image`, `publish-image`],
    }),
    Flow.staticVisual(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `topic`,
            kind: `text_input`,
            label: { emoji: `📌`, text: i18n(`ui.field.topic.label`) },
            placeholder: i18n(`ui.field.topic.placeholder`),
            prompt: i18n(`ui.field.topic.prompt`),
          },
          {
            default: `vertical`,
            id: `layout`,
            kind: `single_choice`,
            label: { emoji: `📐`, text: i18n(`ui.field.layout.label`) },
            options: [
              {
                label: { emoji: `⬇️`, text: i18n(`ui.field.layout.option.vertical.label`) },
                prompt: i18n(`ui.field.layout.option.vertical.prompt`),
                value: `vertical`,
              },
              {
                label: { emoji: `➡️`, text: i18n(`ui.field.layout.option.horizontal.label`) },
                prompt: i18n(`ui.field.layout.option.horizontal.prompt`),
                value: `horizontal`,
              },
            ],
          },
          {
            default: `clean`,
            id: `look`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.look.label`) },
            options: [
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.look.option.clean.label`) },
                prompt: i18n(`ui.field.look.option.clean.prompt`),
                value: `clean`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.look.option.bold.label`) },
                prompt: i18n(`ui.field.look.option.bold.prompt`),
                value: `bold`,
              },
            ],
          },
          {
            default: `blue`,
            id: `colorScheme`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.colorScheme.label`) },
            options: [
              {
                label: { emoji: `🔵`, text: i18n(`ui.field.colorScheme.option.blue.label`) },
                prompt: i18n(`ui.field.colorScheme.option.blue.prompt`),
                value: `blue`,
              },
              {
                label: { emoji: `🟢`, text: i18n(`ui.field.colorScheme.option.green.label`) },
                prompt: i18n(`ui.field.colorScheme.option.green.prompt`),
                value: `green`,
              },
              {
                label: { emoji: `🟠`, text: i18n(`ui.field.colorScheme.option.warm.label`) },
                prompt: i18n(`ui.field.colorScheme.option.warm.prompt`),
                value: `warm`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `Create one infographic image prompt from the topic and every bullet below. Clear hierarchy, labels, icons, and readable layout.`,
          `Создай один промпт для инфографики из темы и каждого пункта ниже. Иерархия, подписи, иконки и читаемая вёрстка.`,
        ]),
        "ui.field.colorScheme.label": [`Colors`, `Цвета`],
        "ui.field.colorScheme.option.blue.label": [`Blue`, `Синие`],
        "ui.field.colorScheme.option.blue.prompt": [`Professional blue/teal palette.`, `Деловая синяя/teal палитра.`],
        "ui.field.colorScheme.option.green.label": [`Green`, `Зелёные`],
        "ui.field.colorScheme.option.green.prompt": [`Fresh green growth palette.`, `Свежая зелёная палитра.`],
        "ui.field.colorScheme.option.warm.label": [`Warm`, `Тёплые`],
        "ui.field.colorScheme.option.warm.prompt": [`Warm orange/red accent palette.`, `Тёплая палитра с orange/red акцентами.`],
        "ui.field.layout.label": [`Layout`, `Вёрстка`],
        "ui.field.layout.option.horizontal.label": [`Horizontal`, `Горизонтальная`],
        "ui.field.layout.option.horizontal.prompt": [`Left-to-right flow.`, `Поток слева направо.`],
        "ui.field.layout.option.vertical.label": [`Vertical`, `Вертикальная`],
        "ui.field.layout.option.vertical.prompt": [`Top-to-bottom flow.`, `Поток сверху вниз.`],
        "ui.field.look.label": [`Look`, `Стиль`],
        "ui.field.look.option.bold.label": [`Bold colors`, `Яркие цвета`],
        "ui.field.look.option.bold.prompt": [`Bold color blocks and contrast.`, `Яркие блоки и контраст.`],
        "ui.field.look.option.clean.label": [`Clean`, `Чистый`],
        "ui.field.look.option.clean.prompt": [`Minimal, lots of whitespace.`, `Минимализм, много воздуха.`],
        "ui.field.topic.label": [`Topic & key points`, `Тема и тезисы`],
        "ui.field.topic.placeholder": [
          `Remote work benefits: flexibility, savings, focus…`,
          `Плюсы удалёнки: гибкость, экономия, фокус…`,
        ],
        "ui.field.topic.prompt": [`Topic:`, `Тема:`],
      }),
    }),
  ],
  meta,
};
