// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Spoken script with pacing and structure`, `Речь или скрипт выступления`],
  emoji: `🎙️`,
  group: `text`,
  title: [`Speech script`, `Скрипт речи`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a speech or talk script — I'll describe the occasion.`,
        `Нужен скрипт выступления — опишу повод.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `brief`,
            kind: `text_input`,
            label: { emoji: `🎙️`, text: i18n(`ui.field.brief.label`) },
            placeholder: i18n(`ui.field.brief.placeholder`),
            prompt: i18n(`ui.field.brief.prompt`),
          },
          {
            default: `5`,
            id: `minutes`,
            kind: `single_choice`,
            label: { emoji: `⏱️`, text: i18n(`ui.field.minutes.label`) },
            options: [
              {
                label: { emoji: `5️⃣`, text: i18n(`ui.field.minutes.option.five.label`) },
                prompt: i18n(`ui.field.minutes.option.five.prompt`),
                value: `5`,
              },
              {
                label: { emoji: `🔟`, text: i18n(`ui.field.minutes.option.ten.label`) },
                prompt: i18n(`ui.field.minutes.option.ten.prompt`),
                value: `10`,
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
          `Write a spoken script from the brief below following every bullet in the parameter list. Natural sentences, clear structure, timing notes if helpful. Output only the script—no preamble.`,
          `Напиши скрипт для устной речи из брифа ниже, строго следуя каждому пункту списка параметров. Естественные фразы, структура, при необходимости пометки по времени. Выведи только скрипт — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.brief.label": [`Occasion & message`, `Повод и сообщение`],
        "ui.field.brief.placeholder": [
          `Team kickoff, thank the team, roadmap…`,
          `Кикофф команды, поблагодарить, роадмап…`,
        ],
        "ui.field.brief.prompt": [`Brief:`, `Бриф:`],
        "ui.field.minutes.label": [`Length`, `Длина`],
        "ui.field.minutes.option.five.label": [`~5 min`, `~5 мин`],
        "ui.field.minutes.option.five.prompt": [`Roughly five minutes spoken.`, `Примерно пять минут речи.`],
        "ui.field.minutes.option.ten.label": [`~10 min`, `~10 мин`],
        "ui.field.minutes.option.ten.prompt": [`Roughly ten minutes spoken.`, `Примерно десять минут речи.`],
      }),
    }),
  ],
  meta,
};
