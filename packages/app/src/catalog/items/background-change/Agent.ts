// cspell:disable
import { StaticFields, StaticImageEditAgent } from "../../../snappy/static-agent";

export const Agent = StaticImageEditAgent(
  () =>
    ({
      "meta.description": [`Remove image background`, `Убрать фон с изображения`],
      "meta.prompt": [
        `Remove the background completely. Keep only the main subject. Transparent background.`,
        `Полностью удали фон. Оставь только главный объект. Прозрачный фон.`,
      ],
      "meta.title": [`Remove background`, `Убрать фон`],
      "ui.field.image.label": [`Image`, `Изображение`],
      "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
    }) as const,
  ({ i18n }) => ({
    description: i18n(`meta.description`),
    emoji: `✂️`,
    group: `edit`,
    plan: {
      fields: StaticFields([
        {
          id: `image`,
          kind: `image_input`,
          label: { emoji: `🖼️`, text: i18n(`ui.field.image.label`) },
          pickLabel: i18n(`ui.field.image.pickLabel`),
        },
      ]),
      title: i18n(`meta.title`),
    },
    prompt: i18n(`meta.prompt`),
  }),
  ({ answers: { image } }) => (image === undefined ? undefined : { background: `transparent`, images: [image] }),
);
