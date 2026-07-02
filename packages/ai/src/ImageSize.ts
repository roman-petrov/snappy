import type { AiImageAspectRatio, AiImageConfig, AiImageConfigKind, AiImageResolution, AiImageSize } from "./Types";

export type ImageRequest = { imageConfig?: AiImageConfig; size?: AiImageSize };

export type ImageToolFields = {
  aspectRatio?: AiImageAspectRatio;
  height?: number;
  resolution?: AiImageResolution;
  size?: AiImageSize;
  width?: number;
};

const request = (
  kind: AiImageConfigKind,
  { aspectRatio, height, resolution, size, width }: ImageToolFields,
): ImageRequest =>
  kind === `flux` && width !== undefined && height !== undefined
    ? { imageConfig: { height, width } }
    : kind === `gemini` && (aspectRatio !== undefined || resolution !== undefined)
      ? { imageConfig: { aspectRatio: aspectRatio ?? `1:1`, ...(resolution === undefined ? {} : { resolution }) } }
      : size === undefined
        ? {}
        : { size };

const apiBody = (imageConfig: AiImageConfig) =>
  `width` in imageConfig
    ? { height: imageConfig.height, width: imageConfig.width }
    : {
        aspect_ratio: imageConfig.aspectRatio,
        ...(imageConfig.resolution === undefined ? {} : { image_size: imageConfig.resolution }),
      };

export const ImageSize = { apiBody, request };
