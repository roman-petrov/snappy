/* eslint-disable id-length */

/* eslint-disable functional/no-promise-reject */
import type { OpenAI } from "openai";
import type { ImagesResponse } from "openai/resources/images";

import type { AiGenericImageModel } from "../Types";

export type OpenAiImageModelConfig = { cost: (usage: OpenAiImageUsage | undefined) => number; name: string };

export type OpenAiImageUsage = ImagesResponse[`usage`];

export const OpenAiImageModel =
  ({ cost, name }: OpenAiImageModelConfig) =>
  (client: OpenAI): AiGenericImageModel => {
    const process: AiGenericImageModel[`process`] = async (prompt, { quality, size }) => {
      const raw = await client.images.generate({
        model: name,
        n: 1,
        prompt,
        ...(quality === undefined ? {} : { quality }),
        size,
      });

      const first = raw.data?.[0];
      if (first === undefined) {
        throw new Error(`openai_image_invalid`);
      }

      const { usage } = raw;
      const costValue = cost(usage);
      const { b64_json: b64, url } = first;

      if (url !== undefined && url.length > 0) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`openai_image_url_fetch`);
        }

        return { bytes: new Uint8Array(await response.arrayBuffer()), cost: costValue };
      }
      if (b64 !== undefined && b64.length > 0) {
        return { bytes: Uint8Array.fromBase64(b64), cost: costValue };
      }

      throw new Error(`openai_image_invalid`);
    };

    return { name, process, type: `image` };
  };
