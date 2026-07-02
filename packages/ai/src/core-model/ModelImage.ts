import type { AiHttpConfig } from "../AiHttp";
import type {
  AiImageAspectRatio,
  AiImageBytesResult,
  AiImageConfigKind,
  AiImageEditInput,
  AiImageGenerateInput,
  AiImageResolution,
  AiImageSize,
  AiModelCapabilities,
} from "../Types";
import type { AiModelEntry } from "./Entry";

import { AiConstants } from "../AiConstants";
import { AiImages } from "../AiImages";
import { ModelEntry } from "./ModelEntry";

export type AiImageModel = CatalogImage & {
  edit: (input: AiImageEditInput) => Promise<AiImageBytesResult>;
  generate: (input: AiImageGenerateInput) => Promise<AiImageBytesResult>;
};

export type CatalogImage = AiModelEntry & {
  defaultImageSize: AiImageSize;
  imageAspectRatios: readonly AiImageAspectRatio[];
  imageConfigKind: AiImageConfigKind;
  imageResolutions: readonly AiImageResolution[];
  imageSizes: readonly AiImageSize[];
  type: `image`;
};

export const ModelImage = (props: {
  capabilities: AiModelCapabilities;
  imageAspectRatios?: readonly AiImageAspectRatio[];
  imageConfigKind?: AiImageConfigKind;
  imageResolutions?: readonly AiImageResolution[];
  imageSizes: readonly AiImageSize[];
  name: string;
}): CatalogImage & { of: (http: AiHttpConfig) => AiImageModel } => {
  const imageMeta = {
    defaultImageSize: props.imageSizes[0] ?? AiConstants.defaults.imageSize,
    imageAspectRatios: props.imageAspectRatios ?? [],
    imageConfigKind: props.imageConfigKind ?? `gpt`,
    imageResolutions: props.imageResolutions ?? [],
    imageSizes: props.imageSizes,
  };

  const entry = ModelEntry.bind(`image`, props, (http, catalog) => ({
    ...catalog,
    ...imageMeta,
    edit: async (input: AiImageEditInput) => AiImages.edit(http, props.name, input),
    generate: async (input: AiImageGenerateInput) => AiImages.generate(http, props.name, input),
  }));

  return { ...entry, ...imageMeta };
};
