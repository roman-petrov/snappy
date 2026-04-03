// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = ({ maxSpeechFileMegaBytes }) =>
  ({
    en: {
      emoji: `🎧`,
      labels: { description: `Transcribe audio and get a tailored summary`, title: `Audio summary` },
      prompt: `You receive an automatic speech-to-text transcript below. Write a summary that follows every bullet in the parameter list exactly. Output only the summary—no preamble, title, or questions.`,
      uiPlan: {
        fields: [
          {
            accept: `audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`,
            hint: `Max ${maxSpeechFileMegaBytes} MB`,
            id: `audio`,
            kind: `file`,
            label: `🎵 Audio file`,
            pickLabel: `Choose file`,
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Emoji`,
            promptOff: `No emoji.`,
            promptOn: `Use emoji where they reinforce meaning; keep the text readable.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Markup`,
            promptOff: `Plain text only (no HTML).`,
            promptOn: `Use HTML for structure: <strong>/<b>, <em>/<i>, <ul>/<ol>/<li>; headings <h2>–<h6> only if they help scanning.`,
          },
          {
            default: `medium`,
            id: `length`,
            kind: `tabs_single`,
            label: `📏 Length`,
            options: [
              { label: `Short`, prompt: `Keep the summary brief: only the essentials.`, value: `short` },
              { label: `Medium`, prompt: `Balanced length: main points with light detail.`, value: `medium` },
              { label: `Long`, prompt: `Detailed summary: cover nuances and examples when present.`, value: `long` },
            ],
          },
          {
            default: `match`,
            id: `outputLang`,
            kind: `tabs_single`,
            label: `🌍 Output language`,
            options: [
              { label: `Match audio`, prompt: `Write in the same language as the transcript.`, value: `match` },
              { label: `English`, prompt: `Write the summary in English.`, value: `en` },
              { label: `Russian`, prompt: `Write the summary in Russian.`, value: `ru` },
            ],
          },
          {
            id: `context`,
            kind: `text`,
            label: `📌 Context (optional)`,
            omitWhenEmpty: true,
            placeholder: `Topic, audience, or goal…`,
            prompt: `Context:`,
          },
        ],
        title: `🎧 Audio summary`,
      },
    },
    group: `audio`,
    ru: {
      emoji: `🎧`,
      labels: { description: `Транскрипт аудио и резюме по вашим правилам`, title: `Резюме аудио` },
      prompt: `Ниже автоматический текст расшифровки речи. Сделай резюме, строго выполняя каждый пункт параметров из списка. В ответе — только резюме: без вступления, заголовка «Резюме» и вопросов.`,
      uiPlan: {
        fields: [
          {
            accept: `audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`,
            hint: `До ${maxSpeechFileMegaBytes} МБ`,
            id: `audio`,
            kind: `file`,
            label: `🎵 Аудиофайл`,
            pickLabel: `Выбрать файл`,
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Эмодзи`,
            promptOff: `Без эмодзи.`,
            promptOn: `Добавляй эмодзи, где усиливают смысл; сохраняй читаемость.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Разметка`,
            promptOff: `Только обычный текст (без HTML).`,
            promptOn: `HTML: <strong>/<b>, <em>/<i>, списки <ul>/<ol>/<li>; заголовки <h2>–<h6> только если помогают структуре.`,
          },
          {
            default: `medium`,
            id: `length`,
            kind: `tabs_single`,
            label: `📏 Длина`,
            options: [
              { label: `Кратко`, prompt: `Коротко: только суть.`, value: `short` },
              { label: `Средне`, prompt: `Сбалансированно: главное и немного деталей.`, value: `medium` },
              { label: `Подробно`, prompt: `Развёрнуто: нюансы и примеры из транскрипта, если есть.`, value: `long` },
            ],
          },
          {
            default: `match`,
            id: `outputLang`,
            kind: `tabs_single`,
            label: `🌍 Язык итога`,
            options: [
              { label: `Как в аудио`, prompt: `Пиши на том же языке, что транскрипт.`, value: `match` },
              { label: `English`, prompt: `Итог на английском.`, value: `en` },
              { label: `Русский`, prompt: `Итог на русском.`, value: `ru` },
            ],
          },
          {
            id: `context`,
            kind: `text`,
            label: `📌 Контекст (необязательно)`,
            omitWhenEmpty: true,
            placeholder: `Тема, аудитория или цель…`,
            prompt: `Контекст:`,
          },
        ],
        title: `🎧 Резюме аудио`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
