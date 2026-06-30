// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Polished resume or CV from your experience`, `Резюме из вашего опыта`],
  emoji: `👔`,
  group: `text`,
  title: [`Resume / CV`, `Резюме`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a resume — I'll paste my experience and target role.`,
        `Нужно резюме — вставлю опыт и целевую роль.`,
      ],
      skill: `text-improvement`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `experience`,
            kind: `text_input`,
            label: { emoji: `📄`, text: i18n(`ui.field.experience.label`) },
            placeholder: i18n(`ui.field.experience.placeholder`),
            prompt: i18n(`ui.field.experience.prompt`),
          },
          {
            id: `target`,
            kind: `text_input`,
            label: { emoji: `🎯`, text: i18n(`ui.field.target.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.target.placeholder`),
            prompt: i18n(`ui.field.target.prompt`),
          },
          {
            default: `chronological`,
            id: `format`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.format.label`) },
            options: [
              {
                label: { emoji: `📅`, text: i18n(`ui.field.format.option.chronological.label`) },
                prompt: i18n(`ui.field.format.option.chronological.prompt`),
                value: `chronological`,
              },
              {
                label: { emoji: `⭐`, text: i18n(`ui.field.format.option.skills.label`) },
                prompt: i18n(`ui.field.format.option.skills.prompt`),
                value: `skills`,
              },
              {
                label: { emoji: `🔀`, text: i18n(`ui.field.format.option.hybrid.label`) },
                prompt: i18n(`ui.field.format.option.hybrid.prompt`),
                value: `hybrid`,
              },
            ],
          },
          {
            default: `tech`,
            id: `industry`,
            kind: `single_choice`,
            label: { emoji: `🏭`, text: i18n(`ui.field.industry.label`) },
            options: [
              {
                label: { emoji: `💻`, text: i18n(`ui.field.industry.option.tech.label`) },
                prompt: i18n(`ui.field.industry.option.tech.prompt`),
                value: `tech`,
              },
              {
                label: { emoji: `📊`, text: i18n(`ui.field.industry.option.business.label`) },
                prompt: i18n(`ui.field.industry.option.business.prompt`),
                value: `business`,
              },
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.industry.option.creative.label`) },
                prompt: i18n(`ui.field.industry.option.creative.prompt`),
                value: `creative`,
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
          `Create a resume/CV from the experience below following every bullet in the parameter list. Tailor to target role if given. Output only the resume—no preamble.`,
          `Составь резюме из опыта ниже, строго следуя каждому пункту списка параметров. Подстрой под целевую роль, если указана. Выведи только резюме — без вступления.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.experience.label": [`Experience`, `Опыт`],
        "ui.field.experience.placeholder": [
          `Jobs, skills, education, achievements…`,
          `Работа, навыки, образование, достижения…`,
        ],
        "ui.field.experience.prompt": [`Experience:`, `Опыт:`],
        "ui.field.format.label": [`Format`, `Формат`],
        "ui.field.format.option.chronological.label": [`Chronological`, `Хронология`],
        "ui.field.format.option.chronological.prompt": [
          `Reverse-chronological work history.`,
          `Обратная хронология опыта работы.`,
        ],
        "ui.field.format.option.hybrid.label": [`Hybrid`, `Гибрид`],
        "ui.field.format.option.hybrid.prompt": [
          `Skills summary plus condensed experience.`,
          `Блок навыков плюс сжатый опыт.`,
        ],
        "ui.field.format.option.skills.label": [`Skills-first`, `Навыки`],
        "ui.field.format.option.skills.prompt": [
          `Lead with skills and projects; lighter job history.`,
          `Сначала навыки и проекты; опыт короче.`,
        ],
        "ui.field.industry.label": [`Industry`, `Отрасль`],
        "ui.field.industry.option.business.label": [`Business`, `Бизнес`],
        "ui.field.industry.option.business.prompt": [
          `Emphasize metrics, leadership, and business impact.`,
          `Акцент на метриках, лидерстве и бизнес-результатах.`,
        ],
        "ui.field.industry.option.creative.label": [`Creative`, `Креатив`],
        "ui.field.industry.option.creative.prompt": [
          `Highlight portfolio, projects, and creative outcomes.`,
          `Портфолио, проекты и креативные результаты.`,
        ],
        "ui.field.industry.option.tech.label": [`Tech`, `IT`],
        "ui.field.industry.option.tech.prompt": [
          `Emphasize tech stack, systems, and engineering impact.`,
          `Стек, системы и инженерный impact.`,
        ],
        "ui.field.target.label": [`Target role (optional)`, `Целевая роль (необязательно)`],
        "ui.field.target.placeholder": [`Senior product manager…`, `Senior product manager…`],
        "ui.field.target.prompt": [`Target role:`, `Целевая роль:`],
      }),
    }),
  ],
  meta,
};
