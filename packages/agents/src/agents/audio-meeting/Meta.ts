// cspell:disable
/* jscpd:ignore-start */
import { StaticAgentMeta } from "../../common/static-agent";

export const Data = StaticAgentMeta(
  parameters =>
    ({
      "meta.description": [
        ``,
        `Meeting recording → structured notes, decisions, actions`,
        `Запись встречи → структура, итоги, договорённости`,
      ],
      "meta.title": [``, `Meeting notes`, `Протокол встречи`],
      "ui.field.addEmoji.label": [`😎`, `Emoji`, `Эмодзи`],
      "ui.field.addFormatting.label": [`📝`, `Markup`, `Разметка`],
      "ui.field.audio.hint": [
        ``,
        `Max ${parameters.maxSpeechFileMegaBytes} MB`,
        `До ${parameters.maxSpeechFileMegaBytes} МБ`,
      ],
      "ui.field.audio.label": [`🎵`, `Meeting recording`, `Запись встречи`],
      "ui.field.audio.pickLabel": [``, `Choose file`, `Выбрать файл`],
      "ui.field.context.label": [`👥`, `Context (optional)`, `Контекст (необязательно)`],
      "ui.field.context.placeholder": [
        ``,
        `Meeting title, participant names, project…`,
        `Название, участники, проект…`,
      ],
      "ui.field.meetingType.label": [`📅`, `Meeting type`, `Тип встречи`],
      "ui.field.meetingType.option.client.label": [``, `Client`, `С клиентом`],
      "ui.field.meetingType.option.general.label": [``, `General`, `Общая`],
      "ui.field.meetingType.option.planning.label": [``, `Planning`, `Планирование`],
      "ui.field.meetingType.option.standup.label": [``, `Stand-up`, `Стендап`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `📋`,
      group: `audio`,
      plan: {
        fields: [
          {
            accept: `audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`,
            hint: i18n(`ui.field.audio.hint`),
            id: `audio`,
            kind: `file`,
            label: i18n(`ui.field.audio.label`),
            pickLabel: i18n(`ui.field.audio.pickLabel`),
          },
          {
            default: false,
            id: `addEmoji`,
            kind: `toggle`,
            label: i18n(`ui.field.addEmoji.label`),
            promptOff: `No emoji.`,
            promptOn: `Use emoji sparingly for section cues only.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: i18n(`ui.field.addFormatting.label`),
            promptOff: `Plain text with clear headings as lines (e.g. ALL CAPS lines).`,
            promptOn: `Use HTML: <h2>/<h3> for sections, <ul>/<li> for lists, <strong> for emphasis.`,
          },
          {
            default: `general`,
            id: `meetingType`,
            kind: `tabs_single`,
            label: i18n(`ui.field.meetingType.label`),
            options: [
              {
                label: i18n(`ui.field.meetingType.option.standup.label`),
                prompt: `Optimize for daily stand-up: blockers, today, yesterday.`,
                value: `standup`,
              },
              {
                label: i18n(`ui.field.meetingType.option.planning.label`),
                prompt: `Optimize for planning: scope, estimates, dependencies, risks.`,
                value: `planning`,
              },
              {
                label: i18n(`ui.field.meetingType.option.client.label`),
                prompt: `Optimize for client call: asks, commitments, follow-ups.`,
                value: `client`,
              },
              {
                label: i18n(`ui.field.meetingType.option.general.label`),
                prompt: `General meeting: balanced sections below.`,
                value: `general`,
              },
            ],
          },
          {
            id: `context`,
            kind: `text`,
            label: i18n(`ui.field.context.label`),
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.context.placeholder`),
            prompt: `Context (names, project, goal):`,
          },
        ],
      },
      prompt: `You receive an automatic transcript of a meeting (possibly multiple speakers; diarization may be imperfect). Produce structured meeting notes that follow every bullet in the parameter list. If speakers are unclear, label them Speaker A / Speaker B or use names from the optional context. Use sections in order: Overview; Decisions; Agreements & action items (what / who / deadline when mentioned); Open questions; Risks (if any). Output only the notes—no preamble.`,
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
