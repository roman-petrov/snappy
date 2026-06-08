// cspell:disable
import { StaticAudioAgent } from "@snappy/snappy-sdk";

import { Prompts } from "../../Prompts";
import { UiCommon } from "../../UiCommon";

export const Agent = StaticAudioAgent(
  () =>
    ({
      "meta.description": [
        `Transcribe audio and get a tailored summary`,
        `Транскрипт аудио и резюме по вашим правилам`,
      ],
      "meta.prompt": [
        `You receive an automatic speech-to-text transcript below. Write a summary that follows every bullet in the parameter list exactly. Output only the summary—no preamble, title, or questions.`,
        `Ниже — автоматическая расшифровка речи. Напиши резюме, строго следуя каждому пункту списка параметров. Выведи только резюме — без вступления, заголовка и вопросов.`,
      ],
      "meta.title": [`Audio summary`, `Резюме аудио`],
      "ui.field.addEmoji.label": [`Emoji`, `Эмодзи`],
      "ui.field.addEmoji.promptOff": Prompts.emoji.off,
      "ui.field.addEmoji.promptOn": Prompts.emoji.on.moderate,
      "ui.field.addFormatting.label": [`Markup`, `Разметка`],
      "ui.field.addFormatting.promptOff": Prompts.formatting.off,
      "ui.field.addFormatting.promptOn": Prompts.formatting.on,
      "ui.field.audio.hint": UiCommon.audioFileHint,
      "ui.field.audio.label": [`Audio file`, `Аудиофайл`],
      "ui.field.audio.pickLabel": [`Choose file`, `Выбрать файл`],
      "ui.field.context.label": [`Context (optional)`, `Контекст (необязательно)`],
      "ui.field.context.placeholder": [`Topic, audience, or goal…`, `Тема, аудитория или цель…`],
      "ui.field.context.prompt": [`Context:`, `Контекст:`],
      "ui.field.length.label": [`Length`, `Длина`],
      "ui.field.length.option.long.label": [`Long`, `Подробно`],
      "ui.field.length.option.long.prompt": [
        `Detailed summary: cover nuances and examples when present.`,
        `Подробное резюме: нюансы и примеры из речи, если они есть.`,
      ],
      "ui.field.length.option.medium.label": [`Medium`, `Средне`],
      "ui.field.length.option.medium.prompt": [
        `Balanced length: main points with light detail.`,
        `Средняя длина: главное с лёгкой детализацией.`,
      ],
      "ui.field.length.option.short.label": [`Short`, `Кратко`],
      "ui.field.length.option.short.prompt": [`Keep the summary brief: only the essentials.`, `Кратко: только суть.`],
      "ui.field.outputLang.label": [`Output language`, `Язык итога`],
      "ui.field.outputLang.option.en.label": [`English`, `English`],
      "ui.field.outputLang.option.en.prompt": [`Write the summary in English.`, `Напиши резюме на английском.`],
      "ui.field.outputLang.option.match.label": [`Match audio`, `Как в аудио`],
      "ui.field.outputLang.option.match.prompt": [
        `Write in the same language as the transcript.`,
        `Пиши на том же языке, что и расшифровка.`,
      ],
      "ui.field.outputLang.option.ru.label": [`Russian`, `Русский`],
      "ui.field.outputLang.option.ru.prompt": [`Write the summary in Russian.`, `Напиши резюме на русском.`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🎧`,
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
            default: true,
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
            default: `medium`,
            id: `length`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.length.label`) },
            options: [
              {
                label: { emoji: `✂️`, text: i18n(`ui.field.length.option.short.label`) },
                prompt: i18n(`ui.field.length.option.short.prompt`),
                value: `short`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.length.option.medium.label`) },
                prompt: i18n(`ui.field.length.option.medium.prompt`),
                value: `medium`,
              },
              {
                label: { emoji: `📖`, text: i18n(`ui.field.length.option.long.label`) },
                prompt: i18n(`ui.field.length.option.long.prompt`),
                value: `long`,
              },
            ],
          },
          {
            default: `match`,
            id: `outputLang`,
            kind: `single_choice`,
            label: { emoji: `🌍`, text: i18n(`ui.field.outputLang.label`) },
            options: [
              {
                label: { emoji: `🎙️`, text: i18n(`ui.field.outputLang.option.match.label`) },
                prompt: i18n(`ui.field.outputLang.option.match.prompt`),
                value: `match`,
              },
              {
                label: { emoji: `🇬🇧`, text: i18n(`ui.field.outputLang.option.en.label`) },
                prompt: i18n(`ui.field.outputLang.option.en.prompt`),
                value: `en`,
              },
              {
                label: { emoji: `🇷🇺`, text: i18n(`ui.field.outputLang.option.ru.label`) },
                prompt: i18n(`ui.field.outputLang.option.ru.prompt`),
                value: `ru`,
              },
            ],
          },
          {
            id: `context`,
            kind: `text_input`,
            label: { emoji: `📌`, text: i18n(`ui.field.context.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.context.placeholder`),
            prompt: i18n(`ui.field.context.prompt`),
          },
        ],
        title: i18n(`meta.title`),
      },
      prompt: i18n(`meta.prompt`),
    }) as const,
);
