// cspell:disable
/* jscpd:ignore-start */
import { StaticAudioAgent } from "@snappy/snappy-sdk";

export const Agent = StaticAudioAgent(
  ({ maxSpeechFileMegaBytes }) =>
    ({
      "meta.description": [
        `Meeting recording → structured notes, decisions, actions`,
        `Запись встречи → структура, итоги, договорённости`,
      ],
      "meta.prompt": [
        `You receive an automatic transcript of a meeting (possibly multiple speakers; diarization may be imperfect). Produce structured meeting notes that follow every bullet in the parameter list. If speakers are unclear, label them Speaker A / Speaker B or use names from the optional context. Use sections in order: Overview; Decisions; Agreements & action items (what / who / deadline when mentioned); Open questions; Risks (if any). Output only the notes—no preamble.`,
        `Ниже — автоматическая расшифровка встречи (возможно несколько спикеров; разметка по спикерам может быть неточной). Сформируй структурированные заметки, строго следуя каждому пункту списка параметров. Если спикеры неясны, обозначь «Спикер A» / «Спикер B» или используй имена из необязательного контекста. Разделы по порядку: Обзор; Решения; Договорённости и задачи (что / кто / срок, если указан); Открытые вопросы; Риски (если есть). Выведи только заметки — без вступления.`,
      ],
      "meta.title": [`Meeting notes`, `Протокол встречи`],
      "ui.field.addEmoji.label": [`Emoji`, `Эмодзи`],
      "ui.field.addEmoji.promptOff": [`No emoji.`, `Без эмодзи.`],
      "ui.field.addEmoji.promptOn": [
        `Use emoji sparingly for section cues only.`,
        `Эмодзи умеренно, только как маркеры разделов.`,
      ],
      "ui.field.addFormatting.label": [`Markup`, `Разметка`],
      "ui.field.addFormatting.promptOff": [
        `Plain text with clear headings as lines (e.g. ALL CAPS lines).`,
        `Простой текст с явными заголовками строками (например ЗАГЛАВНЫМИ).`,
      ],
      "ui.field.addFormatting.promptOn": [
        `Use HTML: <h2>/<h3> for sections, <ul>/<li> for lists, <strong> for emphasis.`,
        `HTML: <h2>/<h3> для разделов, <ul>/<li> для списков, <strong> для акцента.`,
      ],
      "ui.field.audio.hint": [`Max ${maxSpeechFileMegaBytes} MB`, `До ${maxSpeechFileMegaBytes} МБ`],
      "ui.field.audio.label": [`Meeting recording`, `Запись встречи`],
      "ui.field.audio.pickLabel": [`Choose file`, `Выбрать файл`],
      "ui.field.context.label": [`Context (optional)`, `Контекст (необязательно)`],
      "ui.field.context.placeholder": [`Meeting title, participant names, project…`, `Название, участники, проект…`],
      "ui.field.context.prompt": [`Context (names, project, goal):`, `Контекст (имена, проект, цель):`],
      "ui.field.meetingType.label": [`Meeting type`, `Тип встречи`],
      "ui.field.meetingType.option.client.label": [`Client`, `С клиентом`],
      "ui.field.meetingType.option.client.prompt": [
        `Optimize for client call: asks, commitments, follow-ups.`,
        `Под клиентский звонок: запросы, обязательства, follow-up.`,
      ],
      "ui.field.meetingType.option.general.label": [`General`, `Общая`],
      "ui.field.meetingType.option.general.prompt": [
        `General meeting: balanced sections below.`,
        `Общая встреча: сбалансированные разделы ниже.`,
      ],
      "ui.field.meetingType.option.planning.label": [`Planning`, `Планирование`],
      "ui.field.meetingType.option.planning.prompt": [
        `Optimize for planning: scope, estimates, dependencies, risks.`,
        `Планирование: объём, оценки, зависимости, риски.`,
      ],
      "ui.field.meetingType.option.standup.label": [`Stand-up`, `Стендап`],
      "ui.field.meetingType.option.standup.prompt": [
        `Optimize for daily stand-up: blockers, today, yesterday.`,
        `Ежедневный стендап: блокеры, сегодня, вчера.`,
      ],
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
            kind: `file_input`,
            label: { emoji: `🎵`, text: i18n(`ui.field.audio.label`) },
            pickLabel: i18n(`ui.field.audio.pickLabel`),
          },
          {
            default: false,
            id: `addEmoji`,
            kind: `binary_choice`,
            label: { emoji: `😎`, text: i18n(`ui.field.addEmoji.label`) },
            promptOff: i18n(`ui.field.addEmoji.promptOff`),
            promptOn: i18n(`ui.field.addEmoji.promptOn`),
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `binary_choice`,
            label: { emoji: `📝`, text: i18n(`ui.field.addFormatting.label`) },
            promptOff: i18n(`ui.field.addFormatting.promptOff`),
            promptOn: i18n(`ui.field.addFormatting.promptOn`),
          },
          {
            default: `general`,
            id: `meetingType`,
            kind: `single_choice`,
            label: { emoji: `📅`, text: i18n(`ui.field.meetingType.label`) },
            options: [
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.meetingType.option.standup.label`) },
                prompt: i18n(`ui.field.meetingType.option.standup.prompt`),
                value: `standup`,
              },
              {
                label: { emoji: `🗺️`, text: i18n(`ui.field.meetingType.option.planning.label`) },
                prompt: i18n(`ui.field.meetingType.option.planning.prompt`),
                value: `planning`,
              },
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.meetingType.option.client.label`) },
                prompt: i18n(`ui.field.meetingType.option.client.prompt`),
                value: `client`,
              },
              {
                label: { emoji: `👥`, text: i18n(`ui.field.meetingType.option.general.label`) },
                prompt: i18n(`ui.field.meetingType.option.general.prompt`),
                value: `general`,
              },
            ],
          },
          {
            id: `context`,
            kind: `text_input`,
            label: { emoji: `👥`, text: i18n(`ui.field.context.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.context.placeholder`),
            prompt: i18n(`ui.field.context.prompt`),
          },
        ],
      },
      prompt: i18n(`meta.prompt`),
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
