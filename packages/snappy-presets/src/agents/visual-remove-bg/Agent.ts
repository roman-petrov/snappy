// cspell:disable
import { StaticAgent } from "@snappy/snappy-sdk";

export const Agent = StaticAgent(async ({ ai, answers, feed, isStopped, models, prompt }) => {
  const file = answers[`image`];
  if (!(file instanceof File) || isStopped()) {
    return;
  }

  await feed.generateImage({ ai, edit: { background: `transparent`, images: [file] }, model: models.image, prompt });
})(
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
    group: `visual`,
    plan: {
      fields: [
        {
          accept: `image/*,.png,.jpg,.jpeg,.webp,.gif`,
          id: `image`,
          kind: `file_input`,
          label: { emoji: `🖼️`, text: i18n(`ui.field.image.label`) },
          pickLabel: i18n(`ui.field.image.pickLabel`),
        },
      ],
      title: i18n(`meta.title`),
    },
    prompt: i18n(`meta.prompt`),
  }),
);
