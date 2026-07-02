import type { AgentAiModels, StaticFormAnswers, StaticFormField } from "@snappy/snappy";

import {
  type AiImageAspectRatio,
  type AiImageModel,
  type ImageOrientation,
  type ImageRequest,
  ImageSize,
  type ImageToolFields,
} from "@snappy/ai";
import { Bilingual, type Locale } from "@snappy/intl";

import type { StaticImageFormat, StaticImageFormatOptions } from "./Types";

import { StaticFormValues } from "./StaticFormValues";

const orientationId = `orientation`;
const resolutionId = `resolution`;
const orientationLabel = [`Orientation`, `Ориентация`] as const satisfies Bilingual;
const resolutionLabel = [`Resolution`, `Разрешение`] as const satisfies Bilingual;

const orientationMeta = {
  landscape: { emoji: `🖼️`, prompt: [`Wide horizontal composition.`, `Широкая горизонтальная композиция.`] },
  portrait: { emoji: `📄`, prompt: [`Tall vertical composition.`, `Высокая вертикальная композиция.`] },
  square: { emoji: `⬜`, prompt: [`Balanced square composition.`, `Сбалансированная квадратная композиция.`] },
} as const satisfies Record<ImageOrientation, { emoji: string; prompt: Bilingual }>;

const ratioByOrientation = {
  landscape: [`3:2`, `4:3`, `16:9`, `5:4`, `21:9`],
  portrait: [`2:3`, `3:4`, `4:5`, `9:16`],
  square: [`1:1`],
} as const satisfies Record<ImageOrientation, readonly AiImageAspectRatio[]>;

const order = [`square`, `portrait`, `landscape`] as const satisfies readonly ImageOrientation[];

const config = (format?: StaticImageFormat): StaticImageFormatOptions =>
  format === undefined || typeof format === `boolean` ? {} : typeof format === `string` ? { default: format } : format;

const orientationFields = (model: AiImageModel, value: ImageOrientation): ImageToolFields | undefined => {
  if (model.imageConfigKind === `gemini`) {
    const ratio = ratioByOrientation[value].find(candidate => model.imageAspectRatios.includes(candidate));

    return ratio === undefined ? undefined : { aspectRatio: ratio };
  }

  const size = ImageSize.orientation(model.imageSizes, value);

  return size === undefined ? undefined : { size };
};

const orientations = (model: AiImageModel, format?: StaticImageFormat): ImageOrientation[] => {
  const { orientation: only } = config(format);

  return order.filter(value => (only === undefined || value === only) && orientationFields(model, value) !== undefined);
};

const orientationText = (model: AiImageModel, value: ImageOrientation): string => {
  const fields = orientationFields(model, value);

  return fields?.aspectRatio ?? fields?.size?.replace(`x`, ` × `) ?? ``;
};

const orientationField = (
  locale: Locale,
  model: AiImageModel,
  format?: StaticImageFormat,
): StaticFormField | undefined => {
  const values = orientations(model, format);
  if (values.length < 2) {
    return undefined;
  }

  const { default: preferred } = config(format);

  return {
    default: preferred !== undefined && values.includes(preferred) ? preferred : values[0],
    id: orientationId,
    kind: `single_choice`,
    label: { emoji: `📐`, text: Bilingual.pick(locale, orientationLabel) },
    options: values.map(value => ({
      label: { emoji: orientationMeta[value].emoji, text: orientationText(model, value) },
      prompt: Bilingual.pick(locale, orientationMeta[value].prompt),
      value,
    })),
  };
};

const resolutionField = (locale: Locale, model: AiImageModel): StaticFormField | undefined =>
  model.imageResolutions.length < 2
    ? undefined
    : {
        default: model.imageResolutions[0],
        id: resolutionId,
        kind: `single_choice`,
        label: { emoji: `🔍`, text: Bilingual.pick(locale, resolutionLabel) },
        options: model.imageResolutions.map(value => ({ label: { emoji: `✨`, text: value }, value })),
      };

const extra = (format?: StaticImageFormat) =>
  format === undefined || format === false
    ? undefined
    : (locale: Locale, models: AgentAiModels): readonly StaticFormField[] =>
        [orientationField(locale, models.image, format), resolutionField(locale, models.image)].filter(
          (built): built is StaticFormField => built !== undefined,
        );

const request = (answers: StaticFormAnswers, model: AiImageModel, format?: StaticImageFormat): ImageRequest => {
  if (format === undefined || format === false) {
    return {};
  }

  const available = orientations(model, format);
  const answered = StaticFormValues.singleValue(answers[orientationId]);
  const { default: preferred } = config(format);

  const orientation =
    available.find(value => value === answered) ??
    (preferred === undefined ? undefined : available.find(value => value === preferred)) ??
    available[0];

  const resolutionValue = StaticFormValues.singleValue(answers[resolutionId]);
  const resolution = model.imageResolutions.find(value => value === resolutionValue);

  return ImageSize.request(model.imageConfigKind, {
    ...(orientation === undefined ? {} : orientationFields(model, orientation)),
    ...(resolution === undefined ? {} : { resolution }),
  });
};

export const ImageFormat = { extra, request };
