// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      description: `Clarity, length, tone, emoji, markup`,
      emoji: `✏️`,
      prompt: `Improve the passage under "Text to improve:" below: fix errors and unclear wording, then apply every bullet below exactly. Output only the improved text—no title, preamble, headings, or questions.`,
      title: `Improve text`,
      uiPlan: {
        fields: [
          {
            id: `source`,
            kind: `text`,
            label: `📃 Text`,
            placeholder: `Paste or type the text to improve…`,
            prompt: `Text to improve:`,
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Emoji`,
            promptOff: `Omit emoji.`,
            promptOn: `Add emoji generously: several per section or paragraph where they fit meaning; place them to reinforce tone, not at random. Keep lines readable—do not crowd them or replace words with emoji alone.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Markup`,
            promptOff: `Plain text only (no HTML tags).`,
            promptOn: `Use HTML for structure: <strong> or <b> for emphasis, <em> or <i> for italic, lists with <ul>/<ol> and <li>; add <h2>–<h6> only if they aid scanning.`,
          },
          {
            default: `keep`,
            id: `length`,
            kind: `tabs_single`,
            label: `📏 Length`,
            options: [
              {
                label: `⬇️ Shorter`,
                prompt: `Make the result clearly shorter than the source; cut redundancy and filler.`,
                value: `shorten`,
              },
              { label: `↔️ Same`, prompt: `Keep length roughly the same as the source.`, value: `keep` },
              {
                label: `⬆️ Longer`,
                prompt: `Make the result longer than the source; add only relevant detail, not filler.`,
                value: `extend`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `style`,
            kind: `tabs_single`,
            label: `🎨 Style`,
            options: [
              {
                label: `💼 Business`,
                prompt: `Rewrite in a business style: clear, efficient, professional—suited to work email or internal docs; no slang, no sales pitch.`,
                value: `business`,
              },
              {
                label: `🤝 Friendly`,
                prompt: `Rewrite in a warm, friendly tone: approachable and human, as if talking to someone you respect.`,
                value: `friendly`,
              },
              {
                label: `😄 Humorous`,
                prompt: `Rewrite so the text is funny: jokes, wit, or comic timing—the reader should notice humor on purpose, not just a light tone. Keep substance; no cruelty or punching down.`,
                value: `humorous`,
              },
              {
                label: `⚖️ Neutral`,
                prompt: `Rewrite in a neutral, factual tone: dry and balanced—no persuasion, hype, or emotional coloring.`,
                value: `neutral`,
              },
              {
                label: `🛒 Selling`,
                prompt: `Rewrite in a sales style: like selling copy—strong offer, reasons to act now, objection-handling, clear call to action; honest, no fabricated claims.`,
                value: `selling`,
              },
              {
                label: `🎩 Formal`,
                prompt: `Rewrite in formal register: polished, polite, official-sounding; no contractions or slang.`,
                value: `formal`,
              },
              {
                label: `☕ Casual`,
                prompt: `Rewrite in casual everyday language: relaxed and conversational, not stiff.`,
                value: `casual`,
              },
            ],
          },
        ],
      },
    },
    group: `text`,
    ru: {
      description: `Ясность, длина, тон, эмодзи, разметка`,
      emoji: `✨`,
      prompt: `Улучши текст под строкой «Текст для улучшения:» ниже: исправь ошибки и неясные формулировки, затем выполни строго каждый пункт списка ниже. В ответе — только улучшенный текст: без заголовков, вступлений и вопросов.`,
      title: `Улучшение текста`,
      uiPlan: {
        fields: [
          {
            id: `source`,
            kind: `text`,
            label: `📃 Текст`,
            placeholder: `Вставьте или введите текст…`,
            prompt: `Текст для улучшения:`,
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Эмодзи`,
            promptOff: `Без эмодзи.`,
            promptOn: `Добавляй эмодзи щедро: несколько на блок или абзац, где уместно по смыслу; ставь их для акцента и тона, не хаотично. Сохраняй читаемость — не перегружай строки и не заменяй слова одними эмодзи.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Разметка`,
            promptOff: `Только обычный текст (без HTML-тегов).`,
            promptOn: `Используй HTML для структуры: <strong> или <b> для выделения, <em> или <i> для курсива, списки — <ul>/<ol> и <li>; заголовки <h2>–<h6> — только если облегчают просмотр.`,
          },
          {
            default: `keep`,
            id: `length`,
            kind: `tabs_single`,
            label: `📏 Длина`,
            options: [
              {
                label: `⬇️ Короче`,
                prompt: `Сделай результат заметно короче исходника; убери повторы и воду.`,
                value: `shorten`,
              },
              { label: `↔️ Как есть`, prompt: `Сохрани длину примерно как у исходника.`, value: `keep` },
              {
                label: `⬆️ Длиннее`,
                prompt: `Сделай текст длиннее исходника; добавляй только уместные детали, без воды.`,
                value: `extend`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `style`,
            kind: `tabs_single`,
            label: `🎨 Стиль`,
            options: [
              {
                label: `💼 Деловой`,
                prompt: `Переформулируй в деловом стиле: ясно, по делу, профессионально — как рабочая переписка или внутренний документ; без просторечия и без продающего давления.`,
                value: `business`,
              },
              {
                label: `🤝 Дружеский`,
                prompt: `Переформулируй в дружелюбном тоне: тепло и по-человечески, как к приятелю, но уважительно.`,
                value: `friendly`,
              },
              {
                label: `😄 Юмор`,
                prompt: `Переформулируй так, чтобы текст был смешным: шутки, остроумные ходы, комичные формулировки — читатель должен явно видеть юмор, а не просто «лёгкий» текст. Смысл сохрани; без оскорблений и токсичности.`,
                value: `humorous`,
              },
              {
                label: `⚖️ Нейтральный`,
                prompt: `Переформулируй в нейтральном сухом тоне: только факты и формулировки без убеждения, рекламы и эмоциональной окраски.`,
                value: `neutral`,
              },
              {
                label: `🛒 Продающий`,
                prompt: `Переформулируй в стиле продаж: как продающий текст — оффер, аргументы «почему сейчас», снятие сомнений, явный призыв к действию; честно, без выдуманных обещаний.`,
                value: `selling`,
              },
              {
                label: `🎩 Формальный`,
                prompt: `Переформулируй в формальном стиле: официально, выверенно, вежливо; без разговорных сокращений и просторечия.`,
                value: `formal`,
              },
              {
                label: `☕ Разговорный`,
                prompt: `Переформулируй в разговорной манере: живо и непринуждённо, как в бытовой речи.`,
                value: `casual`,
              },
            ],
          },
        ],
      },
    },
  }) as const;
/* jscpd:ignore-end */
