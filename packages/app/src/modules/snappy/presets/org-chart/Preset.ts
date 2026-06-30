// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Team structure chart from roles and reporting lines`, `Оргструктура по ролям и подчинению`],
  emoji: `🏢`,
  group: `visual`,
  title: [`Org chart`, `Оргсхема`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need an org chart — I'll list roles and who reports to whom.`,
        `Нужна оргсхема — перечислю роли и подчинение.`,
      ],
      tools: [`ask`, `date-time`, `look-image`, `publish-image`],
    }),
    Flow.staticVisual(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `structure`,
            kind: `text_input`,
            label: { emoji: `👥`, text: i18n(`ui.field.structure.label`) },
            placeholder: i18n(`ui.field.structure.placeholder`),
            prompt: i18n(`ui.field.structure.prompt`),
          },
          {
            default: `top_down`,
            id: `direction`,
            kind: `single_choice`,
            label: { emoji: `🔽`, text: i18n(`ui.field.direction.label`) },
            options: [
              {
                label: { emoji: `🔽`, text: i18n(`ui.field.direction.option.top_down.label`) },
                prompt: i18n(`ui.field.direction.option.top_down.prompt`),
                value: `top_down`,
              },
              {
                label: { emoji: `➡️`, text: i18n(`ui.field.direction.option.left_right.label`) },
                prompt: i18n(`ui.field.direction.option.left_right.prompt`),
                value: `left_right`,
              },
            ],
          },
          {
            default: `modern`,
            id: `visualStyle`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.visualStyle.label`) },
            options: [
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.visualStyle.option.modern.label`) },
                prompt: i18n(`ui.field.visualStyle.option.modern.prompt`),
                value: `modern`,
              },
              {
                label: { emoji: `📋`, text: i18n(`ui.field.visualStyle.option.classic.label`) },
                prompt: i18n(`ui.field.visualStyle.option.classic.prompt`),
                value: `classic`,
              },
            ],
          },
          {
            default: `corporate`,
            id: `colorScheme`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.colorScheme.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.colorScheme.option.corporate.label`) },
                prompt: i18n(`ui.field.colorScheme.option.corporate.prompt`),
                value: `corporate`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.colorScheme.option.colorful.label`) },
                prompt: i18n(`ui.field.colorScheme.option.colorful.prompt`),
                value: `colorful`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `Create one org-chart image prompt from the structure description and every bullet below. Boxes, names/roles, and clear reporting lines.`,
          `Создай один промпт для оргсхемы из описания структуры и каждого пункта ниже. Блоки, роли и линии подчинения.`,
        ]),
        "ui.field.colorScheme.label": [`Colors`, `Цвета`],
        "ui.field.colorScheme.option.colorful.label": [`Colorful`, `Яркие`],
        "ui.field.colorScheme.option.colorful.prompt": [`Distinct colors per department/level.`, `Разные цвета по отделам/уровням.`],
        "ui.field.colorScheme.option.corporate.label": [`Corporate`, `Корпоративные`],
        "ui.field.colorScheme.option.corporate.prompt": [`Navy, gray, white corporate palette.`, `Navy, серый, белый — корпоративная палитра.`],
        "ui.field.direction.label": [`Direction`, `Направление`],
        "ui.field.direction.option.left_right.label": [`Left to right`, `Слева направо`],
        "ui.field.direction.option.left_right.prompt": [`Hierarchy flows left to right.`, `Иерархия слева направо.`],
        "ui.field.direction.option.top_down.label": [`Top down`, `Сверху вниз`],
        "ui.field.direction.option.top_down.prompt": [`Classic top-down tree.`, `Классическое дерево сверху вниз.`],
        "ui.field.structure.label": [`Roles & reporting`, `Роли и подчинение`],
        "ui.field.structure.placeholder": [`CEO → CTO, CPO; CTO → 3 engineers…`, `CEO → CTO, CPO; CTO → 3 инженера…`],
        "ui.field.structure.prompt": [`Structure:`, `Структура:`],
        "ui.field.visualStyle.label": [`Style`, `Стиль`],
        "ui.field.visualStyle.option.classic.label": [`Classic`, `Классика`],
        "ui.field.visualStyle.option.classic.prompt": [`Traditional boxes and lines.`, `Классические блоки и линии.`],
        "ui.field.visualStyle.option.modern.label": [`Modern`, `Современный`],
        "ui.field.visualStyle.option.modern.prompt": [`Rounded cards, subtle shadows.`, `Скруглённые карточки, лёгкие тени.`],
      }),
    }),
  ],
  meta,
};
