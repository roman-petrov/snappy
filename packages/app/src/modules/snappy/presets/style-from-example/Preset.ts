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
        ]),
      {
        localization: () => ({
          "prompt": [
            `The first image is a style and composition reference. The second is the user's photo. Create a version of the user's photo in the style of the reference while keeping the subject recognizable.`,
            `Первое изображение — референс стиля и оформления. Второе — фото пользователя. Создай версию фото пользователя в стиле референса, сохранив узнаваемость объекта.`,
          ],
          "ui.field.example.label": [`Style reference`, `Референс стиля`],
          "ui.field.example.pickLabel": [`Choose file`, `Выбрать файл`],
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
