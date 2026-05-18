/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-promise-reject */
import type { AiImageGenerateInput } from "./Types";

import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";

type ImageResponse = { data: { b64_json?: string; url?: string }[]; usage?: { cost_rub?: number } };

const bytesFromB64 = (b64: string) => Uint8Array.from(atob(b64), char => char.codePointAt(0) ?? 0);

const generate = async (http: AiHttpConfig, { model, prompt, quality, size }: AiImageGenerateInput) => {
  const result = await AiHttp.postJson<ImageResponse>(http, `/images/generations`, {
    model,
    prompt,
    ...(quality === undefined ? {} : { quality }),
    size,
  });

  const [row] = result.data;
  if (row === undefined) {
    throw new Error(`ai_image_invalid`);
  }
  const bytes =
    row.b64_json === undefined
      ? await fetch(row.url ?? ``)
          .then(async response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
      : bytesFromB64(row.b64_json);
  if (bytes.length === 0) {
    throw new Error(`ai_image_invalid`);
  }

  return { bytes, cost: AiCost.cost(result.usage) };
};

export const AiImages = { generate };
