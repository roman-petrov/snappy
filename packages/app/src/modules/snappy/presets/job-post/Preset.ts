// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Job posting that attracts the right candidates`, `Вакансия, которая привлекает кандидатов`],
  emoji: `💼`,
  group: `text`,
  title: [`Job post`, `Вакансия`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a job posting — I'll describe the role and company.`, `Нужна вакансия — опишу роль и компанию.`],
      skill: `text-improvement`,
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
            default: `mid`,
            id: `experience`,
            kind: `single_choice`,
            label: { emoji: `📊`, text: i18n(`ui.field.experience.label`) },
            options: [
              {
                label: { emoji: `🌱`, text: i18n(`ui.field.experience.option.junior.label`) },
                prompt: i18n(`ui.field.experience.option.junior.prompt`),
                value: `junior`,
              },
              {
                label: { emoji: `⚖️`, text: i18n(`ui.field.experience.option.mid.label`) },
                prompt: i18n(`ui.field.experience.option.mid.prompt`),
                value: `mid`,
              },
              {
                label: { emoji: `🏆`, text: i18n(`ui.field.experience.option.senior.label`) },
                prompt: i18n(`ui.field.experience.option.senior.prompt`),
                value: `senior`,
              },
            ],
          },
          {
            default: `remote`,
            id: `workFormat`,
            kind: `single_choice`,
            label: { emoji: `🏠`, text: i18n(`ui.field.workFormat.label`) },
            options: [
              {
                label: { emoji: `🏢`, text: i18n(`ui.field.workFormat.option.office.label`) },
                prompt: i18n(`ui.field.workFormat.option.office.prompt`),
                value: `office`,
              },
              {
                label: { emoji: `🔄`, text: i18n(`ui.field.workFormat.option.hybrid.label`) },
                prompt: i18n(`ui.field.workFormat.option.hybrid.prompt`),
                value: `hybrid`,
              },
              {
                label: { emoji: `🌍`, text: i18n(`ui.field.workFormat.option.remote.label`) },
                prompt: i18n(`ui.field.workFormat.option.remote.prompt`),
                value: `remote`,
              },
            ],
          },
          {
            default: `professional`,
            id: `tone`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.tone.label`) },
            options: [
              {
                label: { emoji: `💼`, text: i18n(`ui.field.tone.option.professional.label`) },
                prompt: i18n(`ui.field.tone.option.professional.prompt`),
                value: `professional`,
              },
              {
                label: { emoji: `🚀`, text: i18n(`ui.field.tone.option.startup.label`) },
                prompt: i18n(`ui.field.tone.option.startup.prompt`),
                value: `startup`,
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
          `Write a job posting from the role details below following every bullet in the parameter list. Title, about us, responsibilities, requirements, benefits. Output only the posting—no preamble.`,
          `Напиши вакансию из деталей роли ниже, строго следуя каждому пункту списка параметров. Название, о нас, задачи, требования, плюсы. Выведи только вакансию — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.experience.label": [`Experience`, `Опыт`],
        "ui.field.experience.option.junior.label": [`Junior`, `Junior`],
        "ui.field.experience.option.junior.prompt": [
          `Entry-level or 0–2 years; focus on learning and potential.`,
          `Начальный уровень или 0–2 года; акцент на обучение и потенциал.`,
        ],
        "ui.field.experience.option.mid.label": [`Mid`, `Middle`],
        "ui.field.experience.option.mid.prompt": [
          `Mid-level, 2–5 years; balance independence and growth.`,
          `Middle, 2–5 лет; баланс самостоятельности и роста.`,
        ],
        "ui.field.experience.option.senior.label": [`Senior`, `Senior`],
        "ui.field.experience.option.senior.prompt": [
          `Senior, 5+ years; leadership, mentoring, deep expertise expected.`,
          `Senior, 5+ лет; лидерство, менторство, глубокая экспертиза.`,
        ],
        "ui.field.role.label": [`Role details`, `Детали роли`],
        "ui.field.role.placeholder": [`Senior backend, Go, fintech, remote…`, `Senior backend, Go, финтех, удалёнка…`],
        "ui.field.role.prompt": [`Role:`, `Роль:`],
        "ui.field.tone.label": [`Tone`, `Тон`],
        "ui.field.tone.option.professional.label": [`Professional`, `Деловой`],
        "ui.field.tone.option.professional.prompt": [
          `Formal, corporate tone; clear structure and expectations.`,
          `Формальный, корпоративный тон; чёткая структура и ожидания.`,
        ],
        "ui.field.tone.option.startup.label": [`Startup`, `Стартап`],
        "ui.field.tone.option.startup.prompt": [
          `Energetic, informal; emphasize mission, impact, and culture.`,
          `Энергичный, неформальный; миссия, влияние и культура.`,
        ],
        "ui.field.workFormat.label": [`Work format`, `Формат работы`],
        "ui.field.workFormat.option.hybrid.label": [`Hybrid`, `Гибрид`],
        "ui.field.workFormat.option.hybrid.prompt": [
          `Mix of office and remote; state flexibility clearly.`,
          `Смесь офиса и удалёнки; явно укажи гибкость.`,
        ],
        "ui.field.workFormat.option.office.label": [`Office`, `Офис`],
        "ui.field.workFormat.option.office.prompt": [
          `On-site only; mention location if known from role details.`,
          `Только офис; укажи локацию, если она есть в деталях роли.`,
        ],
        "ui.field.workFormat.option.remote.label": [`Remote`, `Удалёнка`],
        "ui.field.workFormat.option.remote.prompt": [
          `Fully remote; mention timezone or async expectations if relevant.`,
          `Полностью удалённо; при необходимости — часовой пояс или async.`,
        ],
      }),
    }),
  ],
  meta,
};
