/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable no-continue */
import type { AiImageSize } from "@snappy/domain";

import { _, Json } from "@snappy/core";

import type { AiGenericImageModel } from "../../../Types";
import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { Urls } from "../../core";

const name = `gemini-3.1-flash-image-preview` as const;

export const Gemini_3_1_FlashImagePreview = (apiKey: string, calculator: ProxyApiCostCalculator) => {
  const aspectRatios: Record<AiImageSize, `1:1` | `9:16` | `16:9`> = {
    [`256x256`]: `1:1`,
    [`512x512`]: `1:1`,
    [`1024x1024`]: `1:1`,
    [`1024x1792`]: `9:16`,
    [`1792x1024`]: `16:9`,
  };

  const firstImageBase64 = (raw: unknown) => {
    if (!_.isObject(raw)) {
      return undefined;
    }
    const { candidates } = raw as { candidates?: unknown };
    if (!_.isArray(candidates)) {
      return undefined;
    }
    for (const candidate of candidates) {
      if (!_.isObject(candidate)) {
        continue;
      }
      const { content } = candidate as { content?: unknown };
      if (!_.isObject(content)) {
        continue;
      }
      const { parts } = content as { parts?: unknown };
      if (!_.isArray(parts)) {
        continue;
      }
      for (const part of parts) {
        if (!_.isObject(part)) {
          continue;
        }
        const inlinePart = part as { inline_data?: { data?: string }; inlineData?: { data?: string } };
        const data = inlinePart.inlineData?.data ?? inlinePart.inline_data?.data;
        if (_.isString(data) && data.length > 0) {
          return data;
        }
      }
    }

    return undefined;
  };

  const totalTokensFromUsage = (raw: unknown) => {
    if (!_.isObject(raw)) {
      return 0;
    }
    const meta = (raw as { usageMetadata?: { totalTokenCount?: number } }).usageMetadata;
    const count = meta?.totalTokenCount;

    return _.isNumber(count) && count > 0 ? count : 0;
  };

  const process: AiGenericImageModel[`process`] = async (prompt, { size }) => {
    const url = `${Urls.proxyApiGoogleV1BetaBase}/models/${encodeURIComponent(name)}:generateContent`;

    const response = await fetch(url, {
      body: Json.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { imageConfig: { aspectRatio: aspectRatios[size] } },
      }),
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": `application/json` },
      method: `POST`,
    });

    const text = await response.text();
    if (!response.ok) {
      throw new Error(`gemini_image_http_${String(response.status)}`);
    }

    const parsed: unknown = text === `` ? {} : (JSON.parse(text) as unknown);
    const b64 = firstImageBase64(parsed);
    if (b64 === undefined) {
      throw new Error(`gemini_image_invalid`);
    }

    const cost = calculator.image(name, { size, totalTokens: totalTokensFromUsage(parsed) });

    return { bytes: new Uint8Array(Buffer.from(b64, `base64`)), cost };
  };

  return { name, process, type: `image` as const };
};
