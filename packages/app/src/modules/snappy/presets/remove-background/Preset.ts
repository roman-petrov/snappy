// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Remove or replace the background in a photo`, `Убрать или заменить фон на фото`],
  emoji: `🔲`,
  group: `edit`,
  title: [`Remove background`, `Убрать фон`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need to change or remove the background in my photo.`, `Нужно сменить или убрать фон на фото.`],
      skill: `image-editing`,
      tools: [`ask`, `date-time`, `edit-image`, `look-image`, `publish-image`],
    }),
    Flow.staticImageEdit(
      meta,
      ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
        ]),
      {
        localization: () => ({
          "prompt": [
            `Remove the background completely. Keep only the main subject. Transparent background.`,
            `Полностью удали фон. Оставь только главный объект. Прозрачный фон.`,
          ],
          "ui.field.image.label": [`Image`, `Изображение`],
          "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
        }),
        resolve: ({ answers: { image } }) =>
          image === undefined ? undefined : { background: `transparent`, images: [image] },
      },
    ),
  ],
  meta,
};
