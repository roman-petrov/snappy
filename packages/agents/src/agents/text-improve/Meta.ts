// cspell:disable
/* jscpd:ignore-start */
import { StaticAgentMeta } from "../../common/static-agent";

export const Data = StaticAgentMeta(
  () =>
    ({
      "meta.description": [``, `Clarity, length, tone, emoji, markup`, `Ясность, длина, тон, эмодзи, разметка`],
      "meta.title": [``, `Improve text`, `Улучшение текста`],
      "ui.field.addEmoji.label": [`😎`, `Emoji`, `Эмодзи`],
      "ui.field.addFormatting.label": [`📝`, `Markup`, `Разметка`],
      "ui.field.length.label": [`📏`, `Length`, `Длина`],
      "ui.field.length.option.extend.label": [`⬆️`, `Longer`, `Длиннее`],
      "ui.field.length.option.keep.label": [`↔️`, `Same`, `Как есть`],
      "ui.field.length.option.shorten.label": [`⬇️`, `Shorter`, `Короче`],
      "ui.field.source.label": [`📃`, `Text`, `Текст`],
      "ui.field.source.placeholder": [``, `Paste or type the text to improve…`, `Вставьте или введите текст…`],
      "ui.field.style.label": [`🎨`, `Style`, `Стиль`],
      "ui.field.style.option.business.label": [`💼`, `Business`, `Деловой`],
      "ui.field.style.option.casual.label": [`☕`, `Casual`, `Разговорный`],
      "ui.field.style.option.formal.label": [`🎩`, `Formal`, `Формальный`],
      "ui.field.style.option.friendly.label": [`🤝`, `Friendly`, `Дружеский`],
      "ui.field.style.option.humorous.label": [`😄`, `Humorous`, `Юмор`],
      "ui.field.style.option.neutral.label": [`⚖️`, `Neutral`, `Нейтральный`],
      "ui.field.style.option.selling.label": [`🛒`, `Selling`, `Продающий`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `✏️`,
      group: `text`,
      plan: {
        fields: [
          {
            id: `source`,
            kind: `text`,
            label: i18n(`ui.field.source.label`),
            placeholder: i18n(`ui.field.source.placeholder`),
            prompt: `Text to improve:`,
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: i18n(`ui.field.addEmoji.label`),
            promptOff: `Omit emoji.`,
            promptOn: `Add emoji generously: several per section or paragraph where they fit meaning; place them to reinforce tone, not at random. Keep lines readable—do not crowd them or replace words with emoji alone.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: i18n(`ui.field.addFormatting.label`),
            promptOff: `Plain text only (no HTML tags).`,
            promptOn: `Use HTML for structure: <strong> or <b> for emphasis, <em> or <i> for italic, lists with <ul>/<ol> and <li>; add <h2>–<h6> only if they aid scanning.`,
          },
          {
            default: `keep`,
            id: `length`,
            kind: `tabs_single`,
            label: i18n(`ui.field.length.label`),
            options: [
              {
                label: i18n(`ui.field.length.option.shorten.label`),
                prompt: `Make the result clearly shorter than the source; cut redundancy and filler.`,
                value: `shorten`,
              },
              {
                label: i18n(`ui.field.length.option.keep.label`),
                prompt: `Keep length roughly the same as the source.`,
                value: `keep`,
              },
              {
                label: i18n(`ui.field.length.option.extend.label`),
                prompt: `Make the result longer than the source; add only relevant detail, not filler.`,
                value: `extend`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `style`,
            kind: `tabs_single`,
            label: i18n(`ui.field.style.label`),
            options: [
              {
                label: i18n(`ui.field.style.option.business.label`),
                prompt: `Rewrite in a business style: clear, efficient, professional—suited to work email or internal docs; no slang, no sales pitch.`,
                value: `business`,
              },
              {
                label: i18n(`ui.field.style.option.friendly.label`),
                prompt: `Rewrite in a warm, friendly tone: approachable and human, as if talking to someone you respect.`,
                value: `friendly`,
              },
              {
                label: i18n(`ui.field.style.option.humorous.label`),
                prompt: `Rewrite so the text is funny: jokes, wit, or comic timing—the reader should notice humor on purpose, not just a light tone. Keep substance; no cruelty or punching down.`,
                value: `humorous`,
              },
              {
                label: i18n(`ui.field.style.option.neutral.label`),
                prompt: `Rewrite in a neutral, factual tone: dry and balanced—no persuasion, hype, or emotional coloring.`,
                value: `neutral`,
              },
              {
                label: i18n(`ui.field.style.option.selling.label`),
                prompt: `Rewrite in a sales style: like selling copy—strong offer, reasons to act now, objection-handling, clear call to action; honest, no fabricated claims.`,
                value: `selling`,
              },
              {
                label: i18n(`ui.field.style.option.formal.label`),
                prompt: `Rewrite in formal register: polished, polite, official-sounding; no contractions or slang.`,
                value: `formal`,
              },
              {
                label: i18n(`ui.field.style.option.casual.label`),
                prompt: `Rewrite in casual everyday language: relaxed and conversational, not stiff.`,
                value: `casual`,
              },
            ],
          },
        ],
      },
      prompt: `Improve the passage under "Text to improve:" below: fix errors and unclear wording, then apply every bullet below exactly. Output only the improved text—no title, preamble, headings, or questions.`,
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
