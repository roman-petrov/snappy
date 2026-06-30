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
            default: `horizontal`,
            id: `orientation`,
            kind: `single_choice`,
            label: { emoji: `↔️`, text: i18n(`ui.field.orientation.label`) },
            options: [
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.orientation.option.horizontal.label`) },
                prompt: i18n(`ui.field.orientation.option.horizontal.prompt`),
                value: `horizontal`,
              },
              {
                label: { emoji: `↕️`, text: i18n(`ui.field.orientation.option.vertical.label`) },
                prompt: i18n(`ui.field.orientation.option.vertical.prompt`),
                value: `vertical`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `Create one timeline infographic image prompt from the events list and every bullet below. Clear dates, milestones, and flow.`,
          `Создай один промпт для таймлайна из списка событий и каждого пункта ниже. Даты, вехи и поток.`,
        ]),
        "ui.field.events.label": [`Events`, `События`],
        "ui.field.events.placeholder": [
          `Jan: launch; Mar: v2; Jun: expansion…`,
          `Янв: запуск; Мар: v2; Июн: расширение…`,
        ],
        "ui.field.events.prompt": [`Events:`, `События:`],
        "ui.field.orientation.label": [`Orientation`, `Ориентация`],
        "ui.field.orientation.option.horizontal.label": [`Horizontal`, `Горизонтальная`],
        "ui.field.orientation.option.horizontal.prompt": [`Left-to-right timeline.`, `Таймлайн слева направо.`],
        "ui.field.orientation.option.vertical.label": [`Vertical`, `Вертикальная`],
        "ui.field.orientation.option.vertical.prompt": [`Top-to-bottom timeline.`, `Таймлайн сверху вниз.`],
      }),
    }),
  ],
  meta,
};
