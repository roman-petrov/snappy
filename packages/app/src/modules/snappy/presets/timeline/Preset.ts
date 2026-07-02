// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Chronological roadmap with milestones`, `Хронология с вехами`],
  emoji: `📅`,
  group: `visual`,
  title: [`Timeline`, `Таймлайн`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a timeline image — I'll list events and dates.`, `Нужен таймлайн — перечислю события и даты.`],
      tools: [`ask`, `date-time`, `look-image`, `publish-image`],
    }),
    Flow.staticVisual(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `events`,
            kind: `text_input`,
            label: { emoji: `📅`, text: i18n(`ui.field.events.label`) },
            placeholder: i18n(`ui.field.events.placeholder`),
            prompt: i18n(`ui.field.events.prompt`),
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
                label: { emoji: `📜`, text: i18n(`ui.field.visualStyle.option.vintage.label`) },
                prompt: i18n(`ui.field.visualStyle.option.vintage.prompt`),
                value: `vintage`,
              },
            ],
          },
          {
            default: `standard`,
            id: `eventDensity`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.eventDensity.label`) },
            options: [
              {
                label: { emoji: `🦅`, text: i18n(`ui.field.eventDensity.option.sparse.label`) },
                prompt: i18n(`ui.field.eventDensity.option.sparse.prompt`),
                value: `sparse`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.eventDensity.option.standard.label`) },
                prompt: i18n(`ui.field.eventDensity.option.standard.prompt`),
                value: `standard`,
              },
              {
                label: { emoji: `📊`, text: i18n(`ui.field.eventDensity.option.dense.label`) },
                prompt: i18n(`ui.field.eventDensity.option.dense.prompt`),
                value: `dense`,
              },
            ],
          },
        ]),
      format: `landscape`,
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `Create one timeline infographic image prompt from the events list and every bullet below. Clear dates, milestones, and flow.`,
          `Создай один промпт для таймлайна из списка событий и каждого пункта ниже. Даты, вехи и поток.`,
        ]),
        "ui.field.eventDensity.label": [`Density`, `Плотность`],
        "ui.field.eventDensity.option.dense.label": [`Dense`, `Плотно`],
        "ui.field.eventDensity.option.dense.prompt": [
          `Many milestones; compact spacing.`,
          `Много вех; компактные интервалы.`,
        ],
        "ui.field.eventDensity.option.sparse.label": [`Sparse`, `Редко`],
        "ui.field.eventDensity.option.sparse.prompt": [`Few key milestones only.`, `Только ключевые вехи.`],
        "ui.field.eventDensity.option.standard.label": [`Standard`, `Стандарт`],
        "ui.field.eventDensity.option.standard.prompt": [
          `Balanced spacing between events.`,
          `Сбалансированные интервалы между событиями.`,
        ],
        "ui.field.events.label": [`Events`, `События`],
        "ui.field.events.placeholder": [
          `Jan: launch; Mar: v2; Jun: expansion…`,
          `Янв: запуск; Мар: v2; Июн: расширение…`,
        ],
        "ui.field.events.prompt": [`Events:`, `События:`],
        "ui.field.visualStyle.label": [`Style`, `Стиль`],
        "ui.field.visualStyle.option.modern.label": [`Modern`, `Современный`],
        "ui.field.visualStyle.option.modern.prompt": [
          `Clean icons and gradient line.`,
          `Чистые иконки и gradient-линия.`,
        ],
        "ui.field.visualStyle.option.vintage.label": [`Vintage`, `Винтаж`],
        "ui.field.visualStyle.option.vintage.prompt": [
          `Retro paper texture and serif labels.`,
          `Ретро-текстура бумаги и serif-подписи.`,
        ],
      }),
    }),
  ],
  meta,
};
