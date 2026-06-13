import type { AiHttpConfig } from "../AiHttp";
import type { AiImageBytesResult, AiImageEditInput, AiImageGenerateInput, AiModelCapabilities } from "../Types";
import type { AiModelEntry } from "./Entry";

import { AiImages } from "../AiImages";
import { ModelEntry } from "./ModelEntry";

export type AiImageModel = CatalogImage & {
  edit: (input: AiImageEditInput) => Promise<AiImageBytesResult>;
  generate: (input: AiImageGenerateInput) => Promise<AiImageBytesResult>;
};

export type CatalogImage = AiModelEntry & { type: `image` };

export const ModelImage = (props: {
  capabilities: AiModelCapabilities;
  name: string;
}): CatalogImage & { of: (http: AiHttpConfig) => AiImageModel } =>
  ModelEntry.bind(`image`, props, (http, catalog) => ({
    ...catalog,
    edit: async input => AiImages.edit(http, catalog, input),
    generate: async input => AiImages.generate(http, catalog, input),
  }));
