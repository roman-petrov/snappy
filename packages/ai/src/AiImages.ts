/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/naming-convention */
import type { AiImageEditInput, AiImageGenerateInput } from "./Types";

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

const generate = async (http: AiHttpConfig, { model, prompt, quality, size }: AiImageGenerateInput) =>
  bytesFromResult(
    await AiHttp.postJson<ImageResponse>(http, `/images/generations`, {
      model,
      prompt,
      ...(quality === undefined ? {} : { quality }),
      ...(size === undefined ? {} : { size }),
    }),
  );

const edit = async (http: AiHttpConfig, { background, images, model, prompt, quality, size }: AiImageEditInput) => {
  const form = new FormData();
  form.append(`model`, model);
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
