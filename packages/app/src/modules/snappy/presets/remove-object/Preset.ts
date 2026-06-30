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
          {
            default: `natural`,
            id: `fillQuality`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.fillQuality.label`) },
            options: [
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.fillQuality.option.natural.label`) },
                prompt: i18n(`ui.field.fillQuality.option.natural.prompt`),
                value: `natural`,
              },
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.fillQuality.option.blur.label`) },
                prompt: i18n(`ui.field.fillQuality.option.blur.prompt`),
                value: `blur`,
              },
            ],
          },
          {
            id: `context`,
            kind: `text_input`,
            label: { emoji: `💡`, text: i18n(`ui.field.context.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.context.placeholder`),
            prompt: i18n(`ui.field.context.prompt`),
          },
        ]),
      {
        localization: () => ({
          "prompt": [
            `Remove the object or distraction described below from the uploaded image. Fill removed areas naturally; keep everything else unchanged. Preserve subject identity and composition where possible.`,
            `Убери объект или отвлекающий элемент по описанию ниже с загруженного изображения. Заполни область естественно; остальное не меняй. По возможности сохрани узнаваемость и композицию.`,
          ],
          "ui.field.context.label": [`Surroundings (optional)`, `Окружение (необязательно)`],
          "ui.field.context.placeholder": [
            `Brick wall behind, grass field…`,
            `Кирпичная стена, трава…`,
          ],
          "ui.field.context.prompt": [`Background context:`, `Контекст фона:`],
          "ui.field.fillQuality.label": [`Fill`, `Заполнение`],
          "ui.field.fillQuality.option.blur.label": [`Soft blur`, `Мягкий blur`],
          "ui.field.fillQuality.option.blur.prompt": [
            `Gentle blur fill if texture is uncertain.`,
            `Мягкий blur, если текстура неясна.`,
          ],
          "ui.field.fillQuality.option.natural.label": [`Natural`, `Естественно`],
          "ui.field.fillQuality.option.natural.prompt": [
            `Inpaint matching surrounding texture and light.`,
            `Inpaint с совпадением текстуры и света.`,
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
