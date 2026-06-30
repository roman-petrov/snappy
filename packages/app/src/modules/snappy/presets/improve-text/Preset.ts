// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Polish clarity, tone, length, and formatting`, `Улучшить ясность, тон, длину и оформление`],
  emoji: `✏️`,
  group: `text`,
  title: [`Improve text`, `Улучшение текста`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need to improve a piece of text.`, `Мне нужно улучшить текст.`],
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
            default: `keep`,
            id: `length`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.length.label`) },
            options: [
              {
                label: { emoji: `⬇️`, text: i18n(`ui.field.length.option.shorten.label`) },
                prompt: i18n(`ui.field.length.option.shorten.prompt`),
                value: `shorten`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.length.option.keep.label`) },
                prompt: i18n(`ui.field.length.option.keep.prompt`),
                value: `keep`,
              },
              {
                label: { emoji: `⬆️`, text: i18n(`ui.field.length.option.extend.label`) },
                prompt: i18n(`ui.field.length.option.extend.prompt`),
                value: `extend`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.style.option.business.label`) },
                prompt: i18n(`ui.field.style.option.business.prompt`),
                value: `business`,
              },
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.style.option.friendly.label`) },
                prompt: i18n(`ui.field.style.option.friendly.prompt`),
                value: `friendly`,
              },
              {
                label: { emoji: `😄`, text: i18n(`ui.field.style.option.humorous.label`) },
                prompt: i18n(`ui.field.style.option.humorous.prompt`),
                value: `humorous`,
              },
              {
                label: { emoji: `⚖️`, text: i18n(`ui.field.style.option.neutral.label`) },
                prompt: i18n(`ui.field.style.option.neutral.prompt`),
                value: `neutral`,
              },
              {
                label: { emoji: `🛒`, text: i18n(`ui.field.style.option.selling.label`) },
                prompt: i18n(`ui.field.style.option.selling.prompt`),
                value: `selling`,
              },
              {
                label: { emoji: `🎩`, text: i18n(`ui.field.style.option.formal.label`) },
                prompt: i18n(`ui.field.style.option.formal.prompt`),
                value: `formal`,
              },
              {
                label: { emoji: `☕`, text: i18n(`ui.field.style.option.casual.label`) },
                prompt: i18n(`ui.field.style.option.casual.prompt`),
                value: `casual`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": [
          `Improve the passage under "Text to improve:" below: fix errors and unclear wording, then apply every bullet below exactly. Output only the improved text—no title, preamble, headings, or questions.`,
          `Улучши текст под меткой «Текст» ниже: исправь ошибки и неясные места, затем строго выполни каждый пункт списка. Выведи только улучшенный текст — без заголовка, вступления, подзаголовков и вопросов.`,
        ],
        "ui.field.addEmoji.label": [`Emoji`, `Эмодзи`],
        "ui.field.addEmoji.promptOff": Prompts.emoji.off,
        "ui.field.addEmoji.promptOn": Prompts.emoji.on.generous,
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.length.label": [`Length`, `Длина`],
        "ui.field.length.option.extend.label": [`Longer`, `Длиннее`],
        "ui.field.length.option.extend.prompt": [
          `Make the result longer than the source; add only relevant detail, not filler.`,
          `Сделай текст заметно длиннее исходного; добавляй только уместные детали, без воды.`,
        ],
        "ui.field.length.option.keep.label": [`Same`, `Как есть`],
        "ui.field.length.option.keep.prompt": [
          `Keep length roughly the same as the source.`,
          `Сохрани длину примерно как в исходнике.`,
        ],
        "ui.field.length.option.shorten.label": [`Shorter`, `Короче`],
        "ui.field.length.option.shorten.prompt": [
          `Make the result clearly shorter than the source; cut redundancy and filler.`,
          `Сделай текст заметно короче; убери повторы и лишнее.`,
        ],
        "ui.field.source.label": [`Text`, `Текст`],
        "ui.field.source.placeholder": [`Paste or type the text to improve…`, `Вставьте или введите текст…`],
        "ui.field.source.prompt": [`Text to improve:`, `Текст для улучшения:`],
        "ui.field.style.label": [`Style`, `Стиль`],
        "ui.field.style.option.business.label": [`Business`, `Деловой`],
        "ui.field.style.option.business.prompt": [
          `Rewrite in a business style: clear, efficient, professional—suited to work email or internal docs; no slang, no sales pitch.`,
          `Деловой стиль: ясно, по делу, профессионально — как в рабочей переписке; без сленга и без «продажного» тона.`,
        ],
        "ui.field.style.option.casual.label": [`Casual`, `Разговорный`],
        "ui.field.style.option.casual.prompt": [
          `Rewrite in casual everyday language: relaxed and conversational, not stiff.`,
          `Разговорный бытовой язык: непринуждённо и по-человечески, без канцелярита.`,
        ],
        "ui.field.style.option.formal.label": [`Formal`, `Формальный`],
        "ui.field.style.option.formal.prompt": [
          `Rewrite in formal register: polished, polite, official-sounding; no contractions or slang.`,
          `Формальный регистр: выверенно, вежливо, официально; без сокращений и сленга.`,
        ],
        "ui.field.style.option.friendly.label": [`Friendly`, `Дружеский`],
        "ui.field.style.option.friendly.prompt": [
          `Rewrite in a warm, friendly tone: approachable and human, as if talking to someone you respect.`,
          `Тёплый дружеский тон: по-человечески и уважительно, как с близким по духу собеседником.`,
        ],
        "ui.field.style.option.humorous.label": [`Humorous`, `Юмор`],
        "ui.field.style.option.humorous.prompt": [
          `Rewrite so the text is funny: jokes, wit, or comic timing—the reader should notice humor on purpose, not just a light tone. Keep substance; no cruelty or punching down.`,
          `Сделай текст смешным: шутки, ирония или комический ход — юмор должен быть заметен намеренно. Сохрани смысл; без жестокости и унижения.`,
        ],
        "ui.field.style.option.neutral.label": [`Neutral`, `Нейтральный`],
        "ui.field.style.option.neutral.prompt": [
          `Rewrite in a neutral, factual tone: dry and balanced—no persuasion, hype, or emotional coloring.`,
          `Нейтральный сухой тон: факты и баланс; без уговоров, хайпа и эмоциональной окраски.`,
        ],
        "ui.field.style.option.selling.label": [`Selling`, `Продающий`],
        "ui.field.style.option.selling.prompt": [
          `Rewrite in a sales style: like selling copy—strong offer, reasons to act now, objection-handling, clear call to action; honest, no fabricated claims.`,
          `Продающий стиль: сильное предложение, мотив сейчас, отработка возражений, явный призыв; честно, без выдуманных фактов.`,
        ],
      }),
    }),
  ],
  meta,
};
