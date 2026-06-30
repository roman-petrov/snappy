// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Style your photo using a reference image`, `Оформить фото по примеру референса`],
  emoji: `🖼️`,
  group: `edit`,
  title: [`Style from example`, `Оформление по примеру`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I want a new visual style for my photo — I'll share the image.`,
        `Хочу новый визуальный стиль для фото — пришлю снимок.`,
      ],
      skill: `image-editing`,
      tools: [`ask`, `date-time`, `edit-image`, `look-image`, `publish-image`],
    }),
    Flow.staticImageEdit(
      meta,
      ({ form, i18n }) =>
        form([
          {
            id: `example`,
            kind: `image_input`,
            label: { emoji: `✨`, text: i18n(`ui.field.example.label`) },
            pickLabel: i18n(`ui.field.example.pickLabel`),
          },
          {
            id: `photo`,
            kind: `image_input`,
            label: { emoji: `📷`, text: i18n(`ui.field.photo.label`) },
            pickLabel: i18n(`ui.field.photo.pickLabel`),
          },
          {
            default: `medium`,
            id: `intensity`,
            kind: `single_choice`,
            label: { emoji: `🎚️`, text: i18n(`ui.field.intensity.label`) },
            options: [
              {
                label: { emoji: `💫`, text: i18n(`ui.field.intensity.option.subtle.label`) },
                prompt: i18n(`ui.field.intensity.option.subtle.prompt`),
                value: `subtle`,
              },
              {
                label: { emoji: `⚖️`, text: i18n(`ui.field.intensity.option.medium.label`) },
                prompt: i18n(`ui.field.intensity.option.medium.prompt`),
                value: `medium`,
              },
              {
                label: { emoji: `🔥`, text: i18n(`ui.field.intensity.option.strong.label`) },
                prompt: i18n(`ui.field.intensity.option.strong.prompt`),
                value: `strong`,
              },
            ],
          },
          {
            default: `full`,
            id: `areas`,
            kind: `single_choice`,
            label: { emoji: `🎯`, text: i18n(`ui.field.areas.label`) },
            options: [
              {
                label: { emoji: `🖼️`, text: i18n(`ui.field.areas.option.full.label`) },
                prompt: i18n(`ui.field.areas.option.full.prompt`),
                value: `full`,
              },
              {
                label: { emoji: `👤`, text: i18n(`ui.field.areas.option.subject.label`) },
                prompt: i18n(`ui.field.areas.option.subject.prompt`),
                value: `subject`,
              },
              {
                label: { emoji: `🌄`, text: i18n(`ui.field.areas.option.background.label`) },
                prompt: i18n(`ui.field.areas.option.background.prompt`),
                value: `background`,
              },
            ],
          },
        ]),
      {
        localization: () => ({
          "prompt": [
            `The first image is a style and composition reference. The second is the user's photo. Create a version of the user's photo in the style of the reference while keeping the subject recognizable.`,
            `Первое изображение — референс стиля и оформления. Второе — фото пользователя. Создай версию фото пользователя в стиле референса, сохранив узнаваемость объекта.`,
          ],
          "ui.field.areas.label": [`Apply to`, `Применить к`],
          "ui.field.areas.option.background.label": [`Background`, `Фон`],
          "ui.field.areas.option.background.prompt": [
            `Style the background; keep subject natural.`,
            `Стилизуй фон; объект оставь естественным.`,
          ],
          "ui.field.areas.option.full.label": [`Full image`, `Всё фото`],
          "ui.field.areas.option.full.prompt": [
            `Apply reference style to the entire image.`,
            `Примени стиль референса ко всему изображению.`,
          ],
          "ui.field.areas.option.subject.label": [`Subject`, `Объект`],
          "ui.field.areas.option.subject.prompt": [
            `Style the main subject; lighter background treatment.`,
            `Стилизуй главный объект; фон легче.`,
          ],
          "ui.field.example.label": [`Style reference`, `Референс стиля`],
          "ui.field.example.pickLabel": [`Choose file`, `Выбрать файл`],
          "ui.field.intensity.label": [`Intensity`, `Интенсивность`],
          "ui.field.intensity.option.medium.label": [`Medium`, `Средне`],
          "ui.field.intensity.option.medium.prompt": [
            `Balanced transfer of reference style.`,
            `Сбалансированный перенос стиля референса.`,
          ],
          "ui.field.intensity.option.strong.label": [`Strong`, `Сильно`],
          "ui.field.intensity.option.strong.prompt": [
            `Bold style transfer; reference dominates.`,
            `Яркий перенос; референс доминирует.`,
          ],
          "ui.field.intensity.option.subtle.label": [`Subtle`, `Легко`],
          "ui.field.intensity.option.subtle.prompt": [
            `Light touch; keep photo mostly as-is.`,
            `Лёгкий акцент; фото почти как есть.`,
          ],
          "ui.field.photo.label": [`Your photo`, `Ваше фото`],
          "ui.field.photo.pickLabel": [`Choose file`, `Выбрать файл`],
        }),
        resolve: ({ answers: { example, photo } }) =>
          example === undefined || photo === undefined ? undefined : { images: [example, photo] },
      },
    ),
  ],
  meta,
};
