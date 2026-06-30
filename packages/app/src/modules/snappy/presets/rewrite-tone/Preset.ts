// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Same message in a different tone`, `Тот же смысл в другом тоне`],
  emoji: `🎭`,
  group: `text`,
  title: [`Rewrite tone`, `Сменить тон`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `Rewrite my text in a different tone — I'll paste the original.`,
        `Перепиши текст в другом тоне — вставлю оригинал.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `source`,
            kind: `text_input`,
            label: { emoji: `📃`, text: i18n(`ui.field.source.label`) },
            placeholder: i18n(`ui.field.source.placeholder`),
            prompt: i18n(`ui.field.source.prompt`),
          },
          {
            default: `friendly`,
            id: `tone`,
            kind: `single_choice`,
            label: { emoji: `🎭`, text: i18n(`ui.field.tone.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.tone.option.formal.label`) },
                prompt: i18n(`ui.field.tone.option.formal.prompt`),
                value: `formal`,
              },
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.tone.option.friendly.label`) },
                prompt: i18n(`ui.field.tone.option.friendly.prompt`),
                value: `friendly`,
              },
              {
                label: { emoji: `😄`, text: i18n(`ui.field.tone.option.casual.label`) },
                prompt: i18n(`ui.field.tone.option.casual.prompt`),
                value: `casual`,
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
          `Rewrite the source text under "Source" below following every bullet in the parameter list. Keep meaning; change tone only. Output only the rewritten text—no preamble.`,
          `Перепиши исходник под меткой «Исходник» ниже, строго следуя каждому пункту списка параметров. Сохрани смысл; меняй только тон. Выведи только текст — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.source.label": [`Source`, `Исходник`],
        "ui.field.source.placeholder": [`Paste text to rewrite…`, `Вставьте текст для переписывания…`],
        "ui.field.source.prompt": [`Source:`, `Исходник:`],
        "ui.field.tone.label": [`Target tone`, `Целевой тон`],
        "ui.field.tone.option.casual.label": [`Casual`, `Неформальный`],
        "ui.field.tone.option.casual.prompt": [`Relaxed, conversational.`, `Расслабленный, разговорный.`],
        "ui.field.tone.option.formal.label": [`Formal`, `Формальный`],
        "ui.field.tone.option.formal.prompt": [`Professional and formal.`, `Профессиональный и формальный.`],
        "ui.field.tone.option.friendly.label": [`Friendly`, `Дружелюбный`],
        "ui.field.tone.option.friendly.prompt": [`Warm and approachable.`, `Тёплый и располагающий.`],
      }),
    }),
  ],
  meta,
};
