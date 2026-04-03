/* eslint-disable id-length */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-promise-reject */
import type { AiImageSize } from "@snappy/domain";
import type openai from "openai";

import type { AiGenericImageModel } from "../Types";

export type OpenAiImageModelDefinition = {
  b64JsonResponse: boolean;
  cost: (totalTokens: number, size: AiImageSize) => number;
  name: string;
};

export const OpenAiImageModel =
  ({ b64JsonResponse, cost, name }: OpenAiImageModelDefinition) =>
  (client: InstanceType<typeof openai>): AiGenericImageModel => {
    const process: AiGenericImageModel[`process`] = async (prompt, { size }) => {
      const raw = await client.images.generate({
        model: name,
        n: 1,
        prompt,
        size,
        ...(b64JsonResponse ? { response_format: `b64_json` as const } : {}),
      });

      const first = raw.data?.[0];
      if (first === undefined) {
        throw new Error(`openai_image_invalid`);
      }

      const { usage } = raw as { usage?: { total_tokens?: number } };
      const totalTokens = usage?.total_tokens ?? 0;
      const costValue = cost(totalTokens, size);
      const { b64_json: b64, url } = first;

      if (b64 !== undefined && b64.length > 0) {
        return { bytes: new Uint8Array(Buffer.from(b64, `base64`)), cost: costValue };
      }

      if (url !== undefined && url.length > 0) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`openai_image_url_fetch`);
        }

        return { bytes: new Uint8Array(await response.arrayBuffer()), cost: costValue };
      }

      throw new Error(`openai_image_invalid`);
    };

    return { name, process, type: `image` };
  };
