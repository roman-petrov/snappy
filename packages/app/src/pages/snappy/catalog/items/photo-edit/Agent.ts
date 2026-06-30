// cspell:disable
import { StaticAgentPrompt, StaticFields, StaticImageEditAgent } from "../../static-agent";

export const Agent = StaticImageEditAgent(
  () =>
    ({
      "meta.description": [
        `Upload a picture and describe what to change`,
        `Загрузите изображение и опишите, что изменить`,
      ],
      "meta.prompt": [
        `Edit the uploaded image. Apply the instruction below. Keep unchanged areas unless the instruction requires changing them. Preserve composition and subject identity when possible.`,
        `Отредактируй загруженное изображение по инструкции ниже. Не меняй то, что инструкция не затрагивает. По возможности сохраняй композицию и узнаваемость объекта.`,
      ],
      "meta.title": [`Edit image`, `Редактирование изображения`],
      "ui.field.image.label": [`Image`, `Изображение`],
      "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
      "ui.field.instruction.label": [`What to change`, `Что изменить`],
      "ui.field.instruction.placeholder": [
        `Remove the person on the left, change the sky to sunset…`,
        `Убери человека слева, сделай небо закатным…`,
      ],
      "ui.field.instruction.prompt": [`Edit instruction:`, `Инструкция:`],
    }) as const,
  ({ i18n }) => ({
    description: i18n(`meta.description`),
    emoji: `🖌️`,
    group: `edit`,
    plan: {
      fields: StaticFields([
        {
          id: `image`,
          kind: `image_input`,
          label: { emoji: `🖼️`, text: i18n(`ui.field.image.label`) },
          pickLabel: i18n(`ui.field.image.pickLabel`),
        },
        {
          id: `instruction`,
          kind: `text_input`,
          label: { emoji: `✏️`, text: i18n(`ui.field.instruction.label`) },
          placeholder: i18n(`ui.field.instruction.placeholder`),
          prompt: i18n(`ui.field.instruction.prompt`),
        },
      ]),
      title: i18n(`meta.title`),
    },
    prompt: i18n(`meta.prompt`),
  }),
  ({ answers: { image, instruction } }) =>
    image === undefined || instruction === undefined || instruction.trim() === `` ? undefined : { images: [image] },
  ({ answers, plan, prompt }) => StaticAgentPrompt({ answers, mainPrompt: prompt, plan }),
);
