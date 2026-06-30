// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Structured learning path for a new topic`, `План изучения новой темы`],
  emoji: `📖`,
  group: `plan`,
  title: [`Learn topic`, `Изучить тему`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I want to learn something new — I'll name the topic and my level.`,
        `Хочу изучить новое — назову тему и уровень.`,
      ],
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `topic`,
            kind: `text_input`,
            label: { emoji: `📖`, text: i18n(`ui.field.topic.label`) },
            placeholder: i18n(`ui.field.topic.placeholder`),
            prompt: i18n(`ui.field.topic.prompt`),
          },
          {
            default: `beginner`,
            id: `level`,
            kind: `single_choice`,
            label: { emoji: `📊`, text: i18n(`ui.field.level.label`) },
            options: [
              {
                label: { emoji: `🌱`, text: i18n(`ui.field.level.option.beginner.label`) },
                prompt: i18n(`ui.field.level.option.beginner.prompt`),
                value: `beginner`,
              },
              {
                label: { emoji: `📈`, text: i18n(`ui.field.level.option.intermediate.label`) },
                prompt: i18n(`ui.field.level.option.intermediate.prompt`),
                value: `intermediate`,
              },
            ],
          },
          {
            default: `overview`,
            id: `learningGoal`,
            kind: `single_choice`,
            label: { emoji: `🎯`, text: i18n(`ui.field.learningGoal.label`) },
            options: [
              {
                label: { emoji: `🗺️`, text: i18n(`ui.field.learningGoal.option.overview.label`) },
                prompt: i18n(`ui.field.learningGoal.option.overview.prompt`),
                value: `overview`,
              },
              {
                label: { emoji: `📝`, text: i18n(`ui.field.learningGoal.option.exam.label`) },
                prompt: i18n(`ui.field.learningGoal.option.exam.prompt`),
                value: `exam`,
              },
              {
                label: { emoji: `🛠️`, text: i18n(`ui.field.learningGoal.option.practical.label`) },
                prompt: i18n(`ui.field.learningGoal.option.practical.prompt`),
                value: `practical`,
              },
            ],
          },
          {
            default: `standard`,
            id: `depth`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.depth.label`) },
            options: [
              {
                label: { emoji: `⚡`, text: i18n(`ui.field.depth.option.quick.label`) },
                prompt: i18n(`ui.field.depth.option.quick.prompt`),
                value: `quick`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.depth.option.standard.label`) },
                prompt: i18n(`ui.field.depth.option.standard.prompt`),
                value: `standard`,
              },
              {
                label: { emoji: `🔬`, text: i18n(`ui.field.depth.option.deep.label`) },
                prompt: i18n(`ui.field.depth.option.deep.prompt`),
                value: `deep`,
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
          `Create a learning plan for the topic below following every bullet in the parameter list. Phases, concepts, practice ideas, and milestones. Output only the plan—no preamble.`,
          `Составь план обучения по теме ниже, строго следуя каждому пункту списка параметров. Этапы, концепции, практика, вехи. Выведи только план — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.depth.label": [`Depth`, `Глубина`],
        "ui.field.depth.option.deep.label": [`Deep`, `Глубоко`],
        "ui.field.depth.option.deep.prompt": [
          `Thorough coverage with advanced topics and resources.`,
          `Подробное покрытие с продвинутыми темами и ресурсами.`,
        ],
        "ui.field.depth.option.quick.label": [`Quick`, `Быстро`],
        "ui.field.depth.option.quick.prompt": [
          `Essentials only; 1–2 week sprint.`,
          `Только essentials; спринт на 1–2 недели.`,
        ],
        "ui.field.depth.option.standard.label": [`Standard`, `Стандарт`],
        "ui.field.depth.option.standard.prompt": [
          `Balanced path with phases and practice.`,
          `Сбалансированный путь с этапами и практикой.`,
        ],
        "ui.field.learningGoal.label": [`Goal`, `Цель`],
        "ui.field.learningGoal.option.exam.label": [`Exam prep`, `К экзамену`],
        "ui.field.learningGoal.option.exam.prompt": [
          `Focus on testable concepts and practice questions.`,
          `Фокус на проверяемых концепциях и практических вопросах.`,
        ],
        "ui.field.learningGoal.option.overview.label": [`Overview`, `Обзор`],
        "ui.field.learningGoal.option.overview.prompt": [
          `Big picture and key concepts; not exam-focused.`,
          `Общая картина и ключевые концепции; не под экзамен.`,
        ],
        "ui.field.learningGoal.option.practical.label": [`Hands-on`, `Практика`],
        "ui.field.learningGoal.option.practical.prompt": [
          `Projects and exercises over theory.`,
          `Проекты и упражнения важнее теории.`,
        ],
        "ui.field.level.label": [`Your level`, `Ваш уровень`],
        "ui.field.level.option.beginner.label": [`Beginner`, `Новичок`],
        "ui.field.level.option.beginner.prompt": [`Start from fundamentals.`, `С основ.`],
        "ui.field.level.option.intermediate.label": [`Intermediate`, `Средний`],
        "ui.field.level.option.intermediate.prompt": [
          `Skip basics; focus on gaps and depth.`,
          `Без основ; пробелы и глубина.`,
        ],
        "ui.field.topic.label": [`Topic`, `Тема`],
        "ui.field.topic.placeholder": [`Machine learning basics…`, `Основы машинного обучения…`],
        "ui.field.topic.prompt": [`Topic:`, `Тема:`],
      }),
    }),
  ],
  meta,
};
