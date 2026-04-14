// cspell:disable
/* jscpd:ignore-start */
import { Meta } from "../../common/Meta";

export const Data = Meta(
  parameters =>
    ({
      "meta.description": [
        ``,
        `Transcribe audio and get a tailored summary`,
        `Транскрипт аудио и резюме по вашим правилам`,
      ],
      "meta.title": [``, `Audio summary`, `Резюме аудио`],
      "ui.field.addEmoji.label": [`😎`, `Emoji`, `Эмодзи`],
      "ui.field.addFormatting.label": [`📝`, `Markup`, `Разметка`],
      "ui.field.audio.hint": [
        ``,
        `Max ${parameters.maxSpeechFileMegaBytes} MB`,
        `До ${parameters.maxSpeechFileMegaBytes} МБ`,
      ],
      "ui.field.audio.label": [`🎵`, `Audio file`, `Аудиофайл`],
      "ui.field.audio.pickLabel": [``, `Choose file`, `Выбрать файл`],
      "ui.field.context.label": [`📌`, `Context (optional)`, `Контекст (необязательно)`],
      "ui.field.context.placeholder": [``, `Topic, audience, or goal…`, `Тема, аудитория или цель…`],
      "ui.field.length.label": [`📏`, `Length`, `Длина`],
      "ui.field.length.option.long.label": [``, `Long`, `Подробно`],
      "ui.field.length.option.medium.label": [``, `Medium`, `Средне`],
      "ui.field.length.option.short.label": [``, `Short`, `Кратко`],
      "ui.field.outputLang.label": [`🌍`, `Output language`, `Язык итога`],
      "ui.field.outputLang.option.en.label": [``, `English`, `English`],
      "ui.field.outputLang.option.match.label": [``, `Match audio`, `Как в аудио`],
      "ui.field.outputLang.option.ru.label": [``, `Russian`, `Русский`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🎧`,
      group: `audio`,
      prompt: `You receive an automatic speech-to-text transcript below. Write a summary that follows every bullet in the parameter list exactly. Output only the summary—no preamble, title, or questions.`,
      title: i18n(`meta.title`),
      uiPlan: {
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
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: i18n(`ui.field.addEmoji.label`),
            promptOff: `No emoji.`,
            promptOn: `Use emoji where they reinforce meaning; keep the text readable.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: i18n(`ui.field.addFormatting.label`),
            promptOff: `Plain text only (no HTML).`,
            promptOn: `Use HTML for structure: <strong>/<b>, <em>/<i>, <ul>/<ol>/<li>; headings <h2>–<h6> only if they help scanning.`,
          },
          {
            default: `medium`,
            id: `length`,
            kind: `tabs_single`,
            label: i18n(`ui.field.length.label`),
            options: [
              {
                label: i18n(`ui.field.length.option.short.label`),
                prompt: `Keep the summary brief: only the essentials.`,
                value: `short`,
              },
              {
                label: i18n(`ui.field.length.option.medium.label`),
                prompt: `Balanced length: main points with light detail.`,
                value: `medium`,
              },
              {
                label: i18n(`ui.field.length.option.long.label`),
                prompt: `Detailed summary: cover nuances and examples when present.`,
                value: `long`,
              },
            ],
          },
          {
            default: `match`,
            id: `outputLang`,
            kind: `tabs_single`,
            label: i18n(`ui.field.outputLang.label`),
            options: [
              {
                label: i18n(`ui.field.outputLang.option.match.label`),
                prompt: `Write in the same language as the transcript.`,
                value: `match`,
              },
              {
                label: i18n(`ui.field.outputLang.option.en.label`),
                prompt: `Write the summary in English.`,
                value: `en`,
              },
              {
                label: i18n(`ui.field.outputLang.option.ru.label`),
                prompt: `Write the summary in Russian.`,
                value: `ru`,
              },
            ],
          },
          {
            id: `context`,
            kind: `text`,
            label: i18n(`ui.field.context.label`),
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.context.placeholder`),
            prompt: `Context:`,
          },
        ],
      },
    }) as const,
);
/* jscpd:ignore-end */
