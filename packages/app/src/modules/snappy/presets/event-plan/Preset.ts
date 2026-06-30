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
            default: `meetup`,
            id: `eventType`,
            kind: `single_choice`,
            label: { emoji: `🏷️`, text: i18n(`ui.field.eventType.label`) },
            options: [
              {
                label: { emoji: `👥`, text: i18n(`ui.field.eventType.option.meetup.label`) },
                prompt: i18n(`ui.field.eventType.option.meetup.prompt`),
                value: `meetup`,
              },
              {
                label: { emoji: `🎤`, text: i18n(`ui.field.eventType.option.conference.label`) },
                prompt: i18n(`ui.field.eventType.option.conference.prompt`),
                value: `conference`,
              },
              {
                label: { emoji: `🎉`, text: i18n(`ui.field.eventType.option.party.label`) },
                prompt: i18n(`ui.field.eventType.option.party.prompt`),
                value: `party`,
              },
            ],
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
              {
                label: { emoji: `📋`, text: i18n(`ui.field.focus.option.full.label`) },
                prompt: i18n(`ui.field.focus.option.full.prompt`),
                value: `full`,
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
        "ui.field.eventType.label": [`Event type`, `Тип`],
        "ui.field.eventType.option.conference.label": [`Conference`, `Конференция`],
        "ui.field.eventType.option.conference.prompt": [
          `Multi-track sessions, speakers, registration flow.`,
          `Несколько треков, спикеры, регистрация.`,
        ],
        "ui.field.eventType.option.meetup.label": [`Meetup`, `Митап`],
        "ui.field.eventType.option.meetup.prompt": [
          `Informal gathering; networking and short talks.`,
          `Неформальная встреча; нетворкинг и короткие доклады.`,
        ],
        "ui.field.eventType.option.party.label": [`Party`, `Праздник`],
        "ui.field.eventType.option.party.prompt": [
          `Celebration focus; entertainment and catering emphasis.`,
          `Праздничный фокус; развлечения и кейтеринг.`,
        ],
        "ui.field.focus.label": [`Output`, `Результат`],
        "ui.field.focus.option.agenda.label": [`Agenda`, `Повестка`],
        "ui.field.focus.option.agenda.prompt": [
          `Timed agenda with sessions and breaks.`,
          `Повестка по времени с сессиями и перерывами.`,
        ],
        "ui.field.focus.option.full.label": [`Full plan`, `Полный план`],
        "ui.field.focus.option.full.prompt": [
          `Agenda plus logistics, roles, and checklist.`,
          `Повестка плюс логистика, роли и чеклист.`,
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
