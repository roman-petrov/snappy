// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Likely questions and strong answer angles`, `Вероятные вопросы и сильные ответы`],
  emoji: `🎤`,
  group: `plan`,
  title: [`Interview prep`, `Подготовка к интервью`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I have an interview coming up — I'll share the role and my background.`,
        `Скоро интервью — расскажу о роли и своём опыте.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `role`,
            kind: `text_input`,
            label: { emoji: `💼`, text: i18n(`ui.field.role.label`) },
            placeholder: i18n(`ui.field.role.placeholder`),
            prompt: i18n(`ui.field.role.prompt`),
          },
          {
            id: `background`,
            kind: `text_input`,
            label: { emoji: `📄`, text: i18n(`ui.field.background.label`) },
            placeholder: i18n(`ui.field.background.placeholder`),
            prompt: i18n(`ui.field.background.prompt`),
          },
          {
            default: `hr`,
            id: `interviewType`,
            kind: `single_choice`,
            label: { emoji: `🎯`, text: i18n(`ui.field.interviewType.label`) },
            options: [
              {
                label: { emoji: `👔`, text: i18n(`ui.field.interviewType.option.hr.label`) },
                prompt: i18n(`ui.field.interviewType.option.hr.prompt`),
                value: `hr`,
              },
              {
                label: { emoji: `💻`, text: i18n(`ui.field.interviewType.option.technical.label`) },
                prompt: i18n(`ui.field.interviewType.option.technical.prompt`),
                value: `technical`,
              },
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.interviewType.option.behavioral.label`) },
                prompt: i18n(`ui.field.interviewType.option.behavioral.prompt`),
                value: `behavioral`,
              },
            ],
          },
          {
            default: `qa`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.format.label`) },
            options: [
              {
                label: { emoji: `❓`, text: i18n(`ui.field.format.option.qa.label`) },
                prompt: i18n(`ui.field.format.option.qa.prompt`),
                value: `qa`,
              },
              {
                label: { emoji: `📚`, text: i18n(`ui.field.format.option.study.label`) },
                prompt: i18n(`ui.field.format.option.study.prompt`),
                value: `study`,
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
          `Prepare interview Q&A from the role and background below following every bullet in the parameter list. Include likely questions, answer outlines, and stories to mention. Output only the prep—no preamble.`,
          `Подготовь вопросы и ответы для интервью из роли и бэкграунда ниже, строго следуя каждому пункту списка параметров. Вероятные вопросы, план ответов, истории. Выведи только подготовку — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.background.label": [`Your background`, `Ваш опыт`],
        "ui.field.background.placeholder": [
          `5 years backend, led payments team…`,
          `5 лет бэкенд, вёл команду платежей…`,
        ],
        "ui.field.background.prompt": [`Background:`, `Опыт:`],
        "ui.field.format.label": [`Format`, `Формат`],
        "ui.field.format.option.qa.label": [`Q&A list`, `Список Q&A`],
        "ui.field.format.option.qa.prompt": [
          `Likely questions with answer outlines.`,
          `Вероятные вопросы с планом ответов.`,
        ],
        "ui.field.format.option.study.label": [`Study plan`, `План подготовки`],
        "ui.field.format.option.study.prompt": [
          `Topics to review, stories to prepare, day-before checklist.`,
          `Темы для повторения, истории, чеклист накануне.`,
        ],
        "ui.field.interviewType.label": [`Interview type`, `Тип интервью`],
        "ui.field.interviewType.option.behavioral.label": [`Behavioral`, `Поведенческое`],
        "ui.field.interviewType.option.behavioral.prompt": [
          `STAR stories, teamwork, conflict, leadership.`,
          `STAR-истории, командная работа, конфликты, лидерство.`,
        ],
        "ui.field.interviewType.option.hr.label": [`HR / screening`, `HR / скрининг`],
        "ui.field.interviewType.option.hr.prompt": [
          `Motivation, culture fit, salary, career goals.`,
          `Мотивация, культурный fit, зарплата, карьерные цели.`,
        ],
        "ui.field.interviewType.option.technical.label": [`Technical`, `Техническое`],
        "ui.field.interviewType.option.technical.prompt": [
          `Technical depth, system design, coding topics.`,
          `Техническая глубина, system design, coding-темы.`,
        ],
        "ui.field.role.label": [`Role & company`, `Роль и компания`],
        "ui.field.role.placeholder": [`Senior engineer at a fintech startup…`, `Senior engineer в финтех-стартапе…`],
        "ui.field.role.prompt": [`Role:`, `Роль:`],
      }),
    }),
  ],
  meta,
};
