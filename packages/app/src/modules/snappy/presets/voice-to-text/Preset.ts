// cspell:disable
import { Flow, type Preset, Prompts, UiCommon } from "..";

const meta = {
  description: [`Transcribe voice memos into readable text`, `Голосовые заметки в текст`],
  emoji: `🗣️`,
  group: `audio`,
  title: [`Voice to text`, `Голос в текст`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I have a voice recording — I need an accurate transcript.`,
        `Есть голосовая запись — нужна точная расшифровка.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`, `transcribe-audio`],
    }),
    Flow.staticAudio(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            hint: i18n(`ui.field.audio.hint`),
            id: `audio`,
            kind: `audio_input`,
            label: { emoji: `🎵`, text: i18n(`ui.field.audio.label`) },
            pickLabel: i18n(`ui.field.audio.pickLabel`),
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
            default: `standard`,
            id: `punctuation`,
            kind: `single_choice`,
            label: { emoji: `✍️`, text: i18n(`ui.field.punctuation.label`) },
            options: [
              {
                label: { emoji: `📝`, text: i18n(`ui.field.punctuation.option.standard.label`) },
                prompt: i18n(`ui.field.punctuation.option.standard.prompt`),
                value: `standard`,
              },
              {
                label: { emoji: `📄`, text: i18n(`ui.field.punctuation.option.minimal.label`) },
                prompt: i18n(`ui.field.punctuation.option.minimal.prompt`),
                value: `minimal`,
              },
            ],
          },
          {
            default: false,
            id: `speakerLabels`,
            kind: `binary_choice`,
            label: { emoji: `👥`, text: i18n(`ui.field.speakerLabels.label`) },
            promptOff: i18n(`ui.field.speakerLabels.promptOff`),
            promptOn: i18n(`ui.field.speakerLabels.promptOn`),
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
        ]),
      localization: () => ({
        "prompt": [
          `You receive an automatic speech-to-text transcript below. Produce a clean, readable transcript that follows every bullet in the parameter list. Fix obvious recognition errors; do not invent content. Output only the transcript—no preamble or title.`,
          `Ниже — автоматическая расшифровка речи. Выдай чистый читаемый текст, строго следуя каждому пункту списка параметров. Исправь явные ошибки распознавания; не выдумывай содержание. Выведи только расшифровку — без вступления и заголовка.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.audio.hint": UiCommon.audioFileHint,
        "ui.field.audio.label": [`Recording`, `Запись`],
        "ui.field.audio.pickLabel": [`Choose file`, `Выбрать файл`],
        "ui.field.outputLang.label": [`Output language`, `Язык итога`],
        "ui.field.outputLang.option.en.label": [`English`, `English`],
        "ui.field.outputLang.option.en.prompt": [
          `Write the transcript in English.`,
          `Выведи расшифровку на английском.`,
        ],
        "ui.field.outputLang.option.match.label": [`Match audio`, `Как в аудио`],
        "ui.field.outputLang.option.match.prompt": [
          `Keep the same language as the speech.`,
          `Сохрани язык речи из записи.`,
        ],
        "ui.field.outputLang.option.ru.label": [`Russian`, `Русский`],
        "ui.field.outputLang.option.ru.prompt": [`Write the transcript in Russian.`, `Выведи расшифровку на русском.`],
        "ui.field.punctuation.label": [`Punctuation`, `Пунктуация`],
        "ui.field.punctuation.option.minimal.label": [`Minimal`, `Минимум`],
        "ui.field.punctuation.option.minimal.prompt": [
          `Light punctuation; preserve spoken flow.`,
          `Минимум пунктуации; сохрани устный поток.`,
        ],
        "ui.field.punctuation.option.standard.label": [`Standard`, `Стандарт`],
        "ui.field.punctuation.option.standard.prompt": [
          `Full punctuation and paragraph breaks.`,
          `Полная пунктуация и абзацы.`,
        ],
        "ui.field.speakerLabels.label": [`Speaker labels`, `Метки спикеров`],
        "ui.field.speakerLabels.promptOff": [`No speaker labels.`, `Без меток спикеров.`],
        "ui.field.speakerLabels.promptOn": [
          `Label speakers as Speaker 1, Speaker 2 when distinct voices change.`,
          `Помечай спикеров как Speaker 1, Speaker 2 при смене голосов.`,
        ],
      }),
      resolve: ({ answers: { audio } }) => audio,
    }),
  ],
  meta,
};
