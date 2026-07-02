import type { AgentAiModels, StaticFormAnswers, StaticFormField } from "@snappy/snappy";

import { type AiImageSize, type ImageOrientation, ImageSize } from "@snappy/ai";
import { Bilingual, type Locale } from "@snappy/intl";

import { StaticFormValues } from "./StaticFormValues";

const id = `format`;
const label = [`Format`, `Формат`] as const satisfies Bilingual;

const options = [
  {
    emoji: `⬜`,
    label: [`Square`, `Квадрат`],
    prompt: [`Balanced square composition.`, `Сбалансированная квадратная композиция.`],
    value: `square`,
  },
  {
    emoji: `📄`,
    label: [`Portrait`, `Портрет`],
    prompt: [`Tall vertical composition.`, `Высокая вертикальная композиция.`],
    value: `portrait`,
  },
  {
    emoji: `🖼️`,
    label: [`Landscape`, `Альбом`],
    prompt: [`Wide horizontal composition.`, `Широкая горизонтальная композиция.`],
    value: `landscape`,
  },
] as const satisfies readonly { emoji: string; label: Bilingual; prompt: Bilingual; value: ImageOrientation }[];

const field = (locale: Locale, fallback: ImageOrientation = `square`): StaticFormField => ({
  default: fallback,
  id,
  kind: `single_choice`,
  label: { emoji: `📐`, text: Bilingual.pick(locale, label) },
  options: options.map(option => ({
    label: { emoji: option.emoji, text: Bilingual.pick(locale, option.label) },
    prompt: Bilingual.pick(locale, option.prompt),
    value: option.value,
  })),
});

const size = ({ answers, models }: { answers: StaticFormAnswers; models: AgentAiModels }): AiImageSize | undefined =>
  ImageSize.orientation(models.image.imageSizes, StaticFormValues.singleValue(answers[id]));

export const ImageFormat = { field, size };
