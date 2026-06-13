/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/naming-convention */
import type { CatalogImage } from "./core-model/ModelImage";
import type { AiImageBytesResult, AiImageEditInput, AiImageGenerateInput } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type ImageResponse = { data: { b64_json?: string; url?: string }[]; usage?: { cost_rub?: number } };

const bytesFromResult = async (result: ImageResponse) => {
  const [row] = result.data;
  if (row === undefined) {
    throw new Error(`ai_image_invalid`);
  }
  const bytes =
    row.b64_json === undefined
      ? new Uint8Array(await (await fetch(row.url ?? ``)).arrayBuffer())
      : Uint8Array.fromBase64(row.b64_json);
  if (bytes.length === 0) {
    throw new Error(`ai_image_invalid`);
  }

  return { bytes, cost: AiCost.cost(result.usage) };
};

const generate = async (
  http: AiHttpConfig,
  catalog: CatalogImage,
  { prompt, quality, size }: AiImageGenerateInput,
): Promise<AiImageBytesResult> =>
  bytesFromResult(
    await AiHttp.postJson<ImageResponse>(http, `/images/generations`, {
      model: catalog.name,
      prompt,
      ...(quality === undefined ? {} : { quality }),
      ...(size === undefined ? {} : { size }),
    }),
  );

const edit = async (
  http: AiHttpConfig,
  catalog: CatalogImage,
  { background, images, prompt, quality, size }: AiImageEditInput,
): Promise<AiImageBytesResult> => {
  const form = new FormData();
  form.append(`model`, catalog.name);
  form.append(`prompt`, prompt);
  if (background !== undefined) {
    form.append(`background`, background);
  }
  if (quality !== undefined) {
    form.append(`quality`, quality);
  }
  if (size !== undefined) {
    form.append(`size`, size);
  }
  const field = images.length === 1 ? `image` : `image[]`;
  for (const file of images) {
    form.append(field, file, file.name);
  }

  return bytesFromResult(await AiHttp.postForm<ImageResponse>(http, `/images/edits`, form));
};

export const AiImages = { edit, generate };
