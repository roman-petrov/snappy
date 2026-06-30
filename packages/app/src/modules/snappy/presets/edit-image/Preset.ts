// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [`Upload a picture and describe what to change`, `Загрузите изображение и опишите, что изменить`],
  emoji: `🖌️`,
  group: `edit`,
  title: [`Edit image`, `Редактирование изображения`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need to edit a photo — I'll share the image and what to change.`,
        `Нужно отредактировать фото — пришлю снимок и что изменить.`,
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
            default: `custom`,
            id: `editType`,
            kind: `single_choice`,
            label: { emoji: `⚙️`, text: i18n(`ui.field.editType.label`) },
            options: [
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.editType.option.color.label`) },
                prompt: i18n(`ui.field.editType.option.color.prompt`),
                value: `color`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.editType.option.enhance.label`) },
                prompt: i18n(`ui.field.editType.option.enhance.prompt`),
                value: `enhance`,
              },
              {
                label: { emoji: `✂️`, text: i18n(`ui.field.editType.option.crop.label`) },
                prompt: i18n(`ui.field.editType.option.crop.prompt`),
                value: `crop`,
              },
              {
                label: { emoji: `✏️`, text: i18n(`ui.field.editType.option.custom.label`) },
                prompt: i18n(`ui.field.editType.option.custom.prompt`),
                value: `custom`,
              },
            ],
          },
          {
            id: `instruction`,
            kind: `text_input`,
            label: { emoji: `✏️`, text: i18n(`ui.field.instruction.label`) },
            placeholder: i18n(`ui.field.instruction.placeholder`),
            prompt: i18n(`ui.field.instruction.prompt`),
          },
        ]),
      {
        localization: () => ({
          "prompt": [
            `Edit the uploaded image. Apply the instruction below. Keep unchanged areas unless the instruction requires changing them. Preserve composition and subject identity when possible.`,
            `Отредактируй загруженное изображение по инструкции ниже. Не меняй то, что инструкция не затрагивает. По возможности сохраняй композицию и узнаваемость объекта.`,
          ],
          "ui.field.editType.label": [`Edit type`, `Тип правки`],
          "ui.field.editType.option.color.label": [`Color`, `Цвет`],
          "ui.field.editType.option.color.prompt": [
            `Adjust colors, white balance, or saturation.`,
            `Коррекция цвета, баланса белого или насыщенности.`,
          ],
          "ui.field.editType.option.crop.label": [`Crop / resize`, `Кроп / размер`],
          "ui.field.editType.option.crop.prompt": [
            `Crop, reframe, or resize composition.`,
            `Кроп, reframe или изменение композиции.`,
          ],
          "ui.field.editType.option.custom.label": [`Custom`, `Своё`],
          "ui.field.editType.option.custom.prompt": [
            `Follow the instruction field exactly.`,
            `Строго следуй полю инструкции.`,
          ],
          "ui.field.editType.option.enhance.label": [`Enhance`, `Улучшить`],
          "ui.field.editType.option.enhance.prompt": [
            `Sharpen, denoise, improve lighting overall.`,
            `Резкость, шумоподавление, общий свет.`,
          ],
          "ui.field.image.label": [`Image`, `Изображение`],
          "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
          "ui.field.instruction.label": [`What to change`, `Что изменить`],
          "ui.field.instruction.placeholder": [
            `Remove the person on the left, change the sky to sunset…`,
            `Убери человека слева, сделай небо закатным…`,
          ],
          "ui.field.instruction.prompt": [`Edit instruction:`, `Инструкция:`],
        }),
        resolve: ({ answers: { image, instruction } }) =>
          image === undefined || instruction === undefined || instruction.trim() === ``
            ? undefined
            : { images: [image] },
      },
    ),
  ],
  meta,
};
