// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Scene or character art from a creative brief`, `Иллюстрация сцены или персонажа`],
  emoji: `🎨`,
  group: `visual`,
  title: [`Illustration`, `Иллюстрация`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I want a custom illustration — I'll describe the scene or character.`,
        `Хочу авторскую иллюстрацию — опишу сцену или персонажа.`,
      ],
      skill: `image-editing`,
      tools: [`ask`, `date-time`, `look-image`, `publish-image`],
    }),
    Flow.staticVisual(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `brief`,
            kind: `text_input`,
            label: { emoji: `💡`, text: i18n(`ui.field.brief.label`) },
            placeholder: i18n(`ui.field.brief.placeholder`),
            prompt: i18n(`ui.field.brief.prompt`),
          },
          {
            default: `digital`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🖌️`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `🖥️`, text: i18n(`ui.field.style.option.digital.label`) },
                prompt: i18n(`ui.field.style.option.digital.prompt`),
                value: `digital`,
              },
              {
                label: { emoji: `🖍️`, text: i18n(`ui.field.style.option.handdrawn.label`) },
                prompt: i18n(`ui.field.style.option.handdrawn.prompt`),
                value: `handdrawn`,
              },
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.style.option.painterly.label`) },
                prompt: i18n(`ui.field.style.option.painterly.prompt`),
                value: `painterly`,
              },
            ],
          },
          {
            default: `vivid`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🌈`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.palette.option.vivid.label`) },
                prompt: i18n(`ui.field.palette.option.vivid.prompt`),
                value: `vivid`,
              },
              {
                label: { emoji: `🩶`, text: i18n(`ui.field.palette.option.muted.label`) },
                prompt: i18n(`ui.field.palette.option.muted.prompt`),
                value: `muted`,
              },
            ],
          },
        ]),
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `Create one illustration image prompt from the brief and every bullet below. Describe composition, subjects, mood, lighting, and palette. Single centered scene.`,
          `Создай один промпт для иллюстрации из брифа и каждого пункта ниже. Композиция, объекты, настроение, свет и палитра. Одна сцена по центру.`,
        ]),
        "ui.field.brief.label": [`Scene or character`, `Сцена или персонаж`],
        "ui.field.brief.placeholder": [
          `A fox reading in a cozy library at night…`,
          `Лис читает в уютной библиотеке ночью…`,
        ],
        "ui.field.brief.prompt": [`Brief:`, `Бриф:`],
        "ui.field.palette.label": [`Palette`, `Палитра`],
        "ui.field.palette.option.muted.label": [`Muted`, `Приглушённая`],
        "ui.field.palette.option.muted.prompt": [`Soft, muted colors.`, `Мягкие, приглушённые цвета.`],
        "ui.field.palette.option.vivid.label": [`Vivid`, `Яркая`],
        "ui.field.palette.option.vivid.prompt": [`Saturated, vivid colors.`, `Насыщенные, яркие цвета.`],
        "ui.field.style.label": [`Style`, `Стиль`],
        "ui.field.style.option.digital.label": [`Digital`, `Цифровой`],
        "ui.field.style.option.digital.prompt": [`Clean digital illustration.`, `Чистая цифровая иллюстрация.`],
        "ui.field.style.option.handdrawn.label": [`Hand-drawn`, `От руки`],
        "ui.field.style.option.handdrawn.prompt": [`Sketchy hand-drawn look.`, `Эскизный вид от руки.`],
        "ui.field.style.option.painterly.label": [`Painterly`, `Живописный`],
        "ui.field.style.option.painterly.prompt": [`Painterly brush textures.`, `Живописные мазки.`],
      }),
    }),
  ],
  meta,
};
