// cspell:disable
import { StaticFields, StaticImageEditAgent } from "../../static-agent";

export const Agent = StaticImageEditAgent(
  () =>
    ({
      "meta.description": [`Style your photo using a reference image`, `Оформить фото по примеру референса`],
      "meta.prompt": [
        `The first image is a style and composition reference. The second is the user's photo. Create a version of the user's photo in the style of the reference while keeping the subject recognizable.`,
        `Первое изображение — референс стиля и оформления. Второе — фото пользователя. Создай версию фото пользователя в стиле референса, сохранив узнаваемость объекта.`,
      ],
      "meta.title": [`Style from example`, `Оформление по примеру`],
      "ui.field.example.label": [`Style reference`, `Референс стиля`],
      "ui.field.example.pickLabel": [`Choose file`, `Выбрать файл`],
      "ui.field.photo.label": [`Your photo`, `Ваше фото`],
      "ui.field.photo.pickLabel": [`Choose file`, `Выбрать файл`],
    }) as const,
  ({ i18n }) => ({
    description: i18n(`meta.description`),
    emoji: `🎨`,
    group: `edit`,
    plan: {
      fields: StaticFields([
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
      title: i18n(`meta.title`),
    },
    prompt: i18n(`meta.prompt`),
  }),
  ({ answers: { example, photo } }) =>
    example === undefined || photo === undefined ? undefined : { images: [example, photo] },
);
