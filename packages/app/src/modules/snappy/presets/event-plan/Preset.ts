// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Agenda, logistics, and run-of-show for an event`, `Повестка и организация мероприятия`],
  emoji: `🎪`,
  group: `plan`,
  title: [`Event plan`, `План мероприятия`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I'm planning an event — I'll share goals, audience, and constraints.`,
        `Планирую мероприятие — опишу цели, аудиторию и ограничения.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `brief`,
            kind: `text_input`,
            label: { emoji: `🎪`, text: i18n(`ui.field.brief.label`) },
            placeholder: i18n(`ui.field.brief.placeholder`),
            prompt: i18n(`ui.field.brief.prompt`),
          },
          {
            default: `agenda`,
            id: `focus`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.focus.label`) },
            options: [
              {
                label: { emoji: `📋`, text: i18n(`ui.field.focus.option.agenda.label`) },
                prompt: i18n(`ui.field.focus.option.agenda.prompt`),
                value: `agenda`,
              },
              {
                label: { emoji: `📦`, text: i18n(`ui.field.focus.option.logistics.label`) },
                prompt: i18n(`ui.field.focus.option.logistics.prompt`),
                value: `logistics`,
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
          `Create an event plan from the brief below following every bullet in the parameter list. Output only the plan—no preamble.`,
          `Составь план мероприятия из брифа ниже, строго следуя каждому пункту списка параметров. Выведи только план — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.brief.label": [`Event brief`, `Бриф мероприятия`],
        "ui.field.brief.placeholder": [
          `Team offsite, 30 people, 1 day, hybrid…`,
          `Офсайт команды, 30 человек, 1 день, гибрид…`,
        ],
        "ui.field.brief.prompt": [`Brief:`, `Бриф:`],
        "ui.field.focus.label": [`Focus`, `Фокус`],
        "ui.field.focus.option.agenda.label": [`Agenda`, `Повестка`],
        "ui.field.focus.option.agenda.prompt": [
          `Timed agenda with sessions and breaks.`,
          `Повестка по времени с сессиями и перерывами.`,
        ],
        "ui.field.focus.option.logistics.label": [`Logistics`, `Логистика`],
        "ui.field.focus.option.logistics.prompt": [
          `Venue, catering, AV, roles, checklist.`,
          `Площадка, кейтеринг, техника, роли, чеклист.`,
        ],
      }),
    }),
  ],
  meta,
};
