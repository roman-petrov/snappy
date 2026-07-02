/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { AiImageAspectRatio, AiImageModel, AiImageResolution, AiImageSize, ImageToolFields } from "@snappy/ai";

import { z } from "zod";

export type ImageToolInput = ImageToolFields & { prompt: string };

const fluxMaxDimension = 4096;
const fluxMinDimension = 64;

const fluxDimension = z
  .number()
  .int()
  .min(fluxMinDimension)
  .max(fluxMaxDimension)
  .multipleOf(16)
  .optional()
  .describe(`Output dimension in pixels: multiple of 16, up to 4 megapixels total. Pass width and height together.`);

const sizeField = (model: AiImageModel) =>
  z
    .enum(model.imageSizes as [AiImageSize, ...AiImageSize[]])
    .optional()
    .describe(`Output size in pixels. Default: ${model.defaultImageSize}. Omit unless composition depends on it.`);

const fields = (model: AiImageModel) =>
  model.imageConfigKind === `flux`
    ? { height: fluxDimension, size: sizeField(model), width: fluxDimension }
    : model.imageConfigKind === `gemini`
      ? {
          aspectRatio: z
            .enum(model.imageAspectRatios as [AiImageAspectRatio, ...AiImageAspectRatio[]])
            .optional()
            .describe(`Output aspect ratio. Prefer over size.`),
          resolution: z
            .enum(model.imageResolutions as [AiImageResolution, ...AiImageResolution[]])
            .optional()
            .describe(`Output quality tier. Higher tiers cost more.`),
          size: sizeField(model),
        }
      : { size: sizeField(model) };

const inputSchema = <TShape extends z.ZodRawShape = Record<never, never>>(
  model: AiImageModel,
  prompt: string,
  extra?: TShape,
) =>
  z.object({ ...fields(model), ...extra, prompt: z.string().min(1).describe(prompt) }) as unknown as z.ZodType<
    ImageToolInput & z.infer<z.ZodObject<TShape>>
  >;

export const ImageTool = { inputSchema };
