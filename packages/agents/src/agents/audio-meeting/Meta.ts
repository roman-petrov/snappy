// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = ({ maxSpeechFileMegaBytes }) =>
  ({
    en: {
      emoji: `📋`,
      labels: { description: `Meeting recording → structured notes, decisions, actions`, title: `Meeting notes` },
      prompt: `You receive an automatic transcript of a meeting (possibly multiple speakers; diarization may be imperfect). Produce structured meeting notes that follow every bullet in the parameter list. If speakers are unclear, label them Speaker A / Speaker B or use names from the optional context. Use sections in order: Overview; Decisions; Agreements & action items (what / who / deadline when mentioned); Open questions; Risks (if any). Output only the notes—no preamble.`,
      uiPlan: {
        fields: [
          {
            accept: `audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`,
            hint: `Max ${maxSpeechFileMegaBytes} MB`,
            id: `audio`,
            kind: `file`,
            label: `🎵 Meeting recording`,
            pickLabel: `Choose file`,
          },
          {
            default: false,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Emoji`,
            promptOff: `No emoji.`,
            promptOn: `Use emoji sparingly for section cues only.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Markup`,
            promptOff: `Plain text with clear headings as lines (e.g. ALL CAPS lines).`,
            promptOn: `Use HTML: <h2>/<h3> for sections, <ul>/<li> for lists, <strong> for emphasis.`,
          },
          {
            default: `general`,
            id: `meetingType`,
            kind: `tabs_single`,
            label: `📅 Meeting type`,
            options: [
              {
                label: `Stand-up`,
                prompt: `Optimize for daily stand-up: blockers, today, yesterday.`,
                value: `standup`,
              },
              {
                label: `Planning`,
                prompt: `Optimize for planning: scope, estimates, dependencies, risks.`,
                value: `planning`,
              },
              { label: `Client`, prompt: `Optimize for client call: asks, commitments, follow-ups.`, value: `client` },
              { label: `General`, prompt: `General meeting: balanced sections below.`, value: `general` },
            ],
          },
          {
            id: `context`,
            kind: `text`,
            label: `👥 Context (optional)`,
            omitWhenEmpty: true,
            placeholder: `Meeting title, participant names, project…`,
            prompt: `Context (names, project, goal):`,
          },
        ],
        title: `📋 Meeting notes`,
      },
    },
    group: `audio`,
    ru: {
      emoji: `📋`,
      labels: { description: `Запись встречи → структура, итоги, договорённости`, title: `Протокол встречи` },
      prompt: `Ниже автоматическая расшифровка встречи (возможны несколько спикеров; разметка по голосам может быть неточной). Составь структурированный протокол, строго следуя каждому пункту параметров. Если спикеры неочевидны — обозначь Участник A / B или используй имена из контекста. Секции по порядку: Краткое содержание; Принятые решения; Договорённости и действия (что / кто / срок, если звучало); Открытые вопросы; Риски (если есть). В ответе только протокол, без вступления.`,
      uiPlan: {
        fields: [
          {
            accept: `audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`,
            hint: `До ${maxSpeechFileMegaBytes} МБ`,
            id: `audio`,
            kind: `file`,
            label: `🎵 Запись встречи`,
            pickLabel: `Выбрать файл`,
          },
          {
            default: false,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Эмодзи`,
            promptOff: `Без эмодзи.`,
            promptOn: `Эмодзи умеренно, только как маркеры секций.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Разметка`,
            promptOff: `Обычный текст, заголовки строками (например ЗАГЛАВНЫМИ).`,
            promptOn: `HTML: <h2>/<h3> для секций, <ul>/<li> для списков, <strong> для акцентов.`,
          },
          {
            default: `general`,
            id: `meetingType`,
            kind: `tabs_single`,
            label: `📅 Тип встречи`,
            options: [
              { label: `Стендап`, prompt: `Фокус на стендап: блокеры, сегодня, вчера.`, value: `standup` },
              {
                label: `Планирование`,
                prompt: `Фокус на планировании: объём, оценки, зависимости, риски.`,
                value: `planning`,
              },
              {
                label: `С клиентом`,
                prompt: `Фокус на звонке с клиентом: запросы, обязательства, follow-up.`,
                value: `client`,
              },
              { label: `Общая`, prompt: `Общая встреча: сбалансированные секции ниже.`, value: `general` },
            ],
          },
          {
            id: `context`,
            kind: `text`,
            label: `👥 Контекст (необязательно)`,
            omitWhenEmpty: true,
            placeholder: `Название, участники, проект…`,
            prompt: `Контекст (имена, проект, цель):`,
          },
        ],
        title: `📋 Протокол встречи`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
