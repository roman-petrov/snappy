// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Posts tuned for social platforms`, `Посты под соцсети`],
  emoji: `📱`,
  group: `text`,
  title: [`Social post`, `Пост`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a social media post — I'll describe the message.`, `Нужен пост для соцсетей — опишу сообщение.`],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `message`,
            kind: `text_input`,
            label: { emoji: `📱`, text: i18n(`ui.field.message.label`) },
            placeholder: i18n(`ui.field.message.placeholder`),
            prompt: i18n(`ui.field.message.prompt`),
          },
          {
            default: `inform`,
            id: `goal`,
            kind: `single_choice`,
            label: { emoji: `🎯`, text: i18n(`ui.field.goal.label`) },
            options: [
              {
                label: { emoji: `📢`, text: i18n(`ui.field.goal.option.inform.label`) },
                prompt: i18n(`ui.field.goal.option.inform.prompt`),
                value: `inform`,
              },
              {
                label: { emoji: `💬`, text: i18n(`ui.field.goal.option.engage.label`) },
                prompt: i18n(`ui.field.goal.option.engage.prompt`),
                value: `engage`,
              },
              {
                label: { emoji: `🛒`, text: i18n(`ui.field.goal.option.sell.label`) },
                prompt: i18n(`ui.field.goal.option.sell.prompt`),
                value: `sell`,
              },
            ],
          },
          {
            default: `linkedin`,
            id: `platform`,
            kind: `single_choice`,
            label: { emoji: `🌐`, text: i18n(`ui.field.platform.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.platform.option.linkedin.label`) },
                prompt: i18n(`ui.field.platform.option.linkedin.prompt`),
                value: `linkedin`,
              },
              {
                label: { emoji: `🐦`, text: i18n(`ui.field.platform.option.twitter.label`) },
                prompt: i18n(`ui.field.platform.option.twitter.prompt`),
                value: `twitter`,
              },
              {
                label: { emoji: `✈️`, text: i18n(`ui.field.platform.option.telegram.label`) },
                prompt: i18n(`ui.field.platform.option.telegram.prompt`),
                value: `telegram`,
              },
              {
                label: { emoji: `📸`, text: i18n(`ui.field.platform.option.instagram.label`) },
                prompt: i18n(`ui.field.platform.option.instagram.prompt`),
                value: `instagram`,
              },
            ],
          },
          {
            default: false,
            id: `addEmoji`,
            kind: `binary_choice`,
            label: { emoji: `😎`, text: i18n(`ui.field.addEmoji.label`) },
            promptOff: i18n(`ui.field.addEmoji.promptOff`),
            promptOn: i18n(`ui.field.addEmoji.promptOn`),
          },
        ]),
      localization: () => ({
        "prompt": [
          `Write a social post from the message below following every bullet in the parameter list. Output only the post—no preamble.`,
          `Напиши пост из сообщения ниже, строго следуя каждому пункту списка параметров. Выведи только пост — без вступления.`,
        ],
        "ui.field.addEmoji.label": [`Emoji`, `Эмодзи`],
        "ui.field.addEmoji.promptOff": Prompts.emoji.off,
        "ui.field.addEmoji.promptOn": Prompts.emoji.on.moderate,
        "ui.field.goal.label": [`Goal`, `Цель`],
        "ui.field.goal.option.engage.label": [`Engage`, `Вовлечь`],
        "ui.field.goal.option.engage.prompt": [
          `Ask a question or invite comments.`,
          `Задай вопрос или пригласи к обсуждению.`,
        ],
        "ui.field.goal.option.inform.label": [`Inform`, `Информировать`],
        "ui.field.goal.option.inform.prompt": [
          `Share news or update clearly.`,
          `Поделись новостью или обновлением ясно.`,
        ],
        "ui.field.goal.option.sell.label": [`Sell`, `Продать`],
        "ui.field.goal.option.sell.prompt": [
          `Highlight offer with clear CTA; honest claims only.`,
          `Выдели оффер с явным CTA; только честные обещания.`,
        ],
        "ui.field.message.label": [`Message`, `Сообщение`],
        "ui.field.message.placeholder": [`Launching our new feature next week…`, `На следующей неделе запускаем фичу…`],
        "ui.field.message.prompt": [`Message:`, `Сообщение:`],
        "ui.field.platform.label": [`Platform`, `Платформа`],
        "ui.field.platform.option.instagram.label": [`Instagram`, `Instagram`],
        "ui.field.platform.option.instagram.prompt": [
          `Visual-first caption; hashtags at end if natural.`,
          `Caption под визуал; хештеги в конце если уместно.`,
        ],
        "ui.field.platform.option.linkedin.label": [`LinkedIn`, `LinkedIn`],
        "ui.field.platform.option.linkedin.prompt": [
          `Professional tone, 1–3 short paragraphs.`,
          `Деловой тон, 1–3 коротких абзаца.`,
        ],
        "ui.field.platform.option.telegram.label": [`Telegram`, `Telegram`],
        "ui.field.platform.option.telegram.prompt": [
          `Direct, conversational; links and formatting OK.`,
          `Прямо и разговорно; ссылки и разметка OK.`,
        ],
        "ui.field.platform.option.twitter.label": [`X / Twitter`, `X / Twitter`],
        "ui.field.platform.option.twitter.prompt": [
          `Punchy, under ~280 characters if possible.`,
          `Ёмко, по возможности до ~280 символов.`,
        ],
      }),
    }),
  ],
  meta,
};
