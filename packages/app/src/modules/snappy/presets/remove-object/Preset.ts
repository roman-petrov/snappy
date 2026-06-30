// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Remove distractions or unwanted objects`, `Убрать лишнее с фото`],
  emoji: `🧹`,
  group: `edit`,
  title: [`Remove object`, `Удалить объект`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need something removed from a photo — I'll share the image.`,
        `Нужно убрать объект с фото — пришлю снимок.`,
      ],
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
          {
            id: `target`,
            kind: `text_input`,
            label: { emoji: `✂️`, text: i18n(`ui.field.target.label`) },
            placeholder: i18n(`ui.field.target.placeholder`),
            prompt: i18n(`ui.field.target.prompt`),
          },
        ]),
      {
        localization: () => ({
          "prompt": [
            `Remove the object or distraction described below from the uploaded image. Fill removed areas naturally; keep everything else unchanged. Preserve subject identity and composition where possible.`,
            `Убери объект или отвлекающий элемент по описанию ниже с загруженного изображения. Заполни область естественно; остальное не меняй. По возможности сохрани узнаваемость и композицию.`,
          ],
          "ui.field.image.label": [`Photo`, `Фото`],
          "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
          "ui.field.target.label": [`What to remove`, `Что убрать`],
          "ui.field.target.placeholder": [
            `Person in the background, power lines, watermark…`,
            `Человек на заднем плане, провода, водяной знак…`,
          ],
          "ui.field.target.prompt": [`Remove:`, `Убрать:`],
        }),
        resolve: ({ answers: { image, target } }) =>
          image === undefined || target === undefined || target.trim() === `` ? undefined : { images: [image] },
      },
    ),
  ],
  meta,
};
