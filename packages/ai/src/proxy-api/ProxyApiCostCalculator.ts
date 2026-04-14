// cspell:word dall
import type { AiImageSize } from "@snappy/domain";

import { ProxyApiCostMinimums } from "./ProxyApiCostMinimums";
import { ProxyApiPriceList } from "./ProxyApiPriceList";

export type ProxyApiChatCostOptions = { completionTok: number; promptTok: number };

export type ProxyApiImageCostOptions = { size: AiImageSize; totalTokens: number };

export type ProxyApiSpeechCostOptions = {
  audioSeconds: number;
  byteLength: number;
  completionTok: number;
  promptTok: number;
};

const perMillion = 1_000_000;

const chatApiModelToPricesKey = {
  [`gpt-5-mini`]: `gpt_5_mini`,
  [`gpt-5.4-mini`]: `gpt_5_4_mini`,
  [`gpt-5.4-nano`]: `gpt_5_4_nano`,
} as const;

export type ProxyApiChatCostModelId = keyof typeof chatApiModelToPricesKey;

const speechApiModelToPricesKey = { [`gpt-4o-transcribe`]: `gpt_4o_transcribe`, [`whisper-1`]: `whisper_1` } as const;

export type ProxyApiSpeechCostModelId = keyof typeof speechApiModelToPricesKey;

export const proxyApiImageCostModelIds = [
  `dall-e-3`,
  `gemini-3.1-flash-image-preview`,
  `gpt-image-1.5`,
  `gpt-image-1-mini`,
] as const;

export type ProxyApiImageCostModelId = (typeof proxyApiImageCostModelIds)[number];

const chat = (modelId: ProxyApiChatCostModelId, options: ProxyApiChatCostOptions) => {
  const pricesKey = chatApiModelToPricesKey[modelId];
  const { completionTok, promptTok } = options;
  const { rubInputPerMillion, rubOutputPerMillion } = ProxyApiPriceList.chat[pricesKey];

  return Math.max(
    (promptTok / perMillion) * rubInputPerMillion + (completionTok / perMillion) * rubOutputPerMillion,
    ProxyApiCostMinimums.chatRub,
  );
};

const dallE3RubForSize = (size: AiImageSize) => {
  const dallE3 = ProxyApiPriceList.image.dall_e_3;
  const dallE2 = ProxyApiPriceList.image.dall_e_2;

  switch (size) {
    case `256x256`: {
      return dallE2.rubPerImage256x256;
    }
    case `512x512`: {
      return dallE2.rubPerImage512x512;
    }
    case `1024x1024`: {
      return dallE3.rubPerImage1024x1024;
    }
    case `1024x1792`:
    case `1792x1024`: {
      return dallE3.rubPerImage1024x1792Or1792x1024;
    }
    default: {
      return dallE3.rubPerImage1024x1024;
    }
  }
};

const gptImageLowMediumRubForSize = (
  tiers: (typeof ProxyApiPriceList.image)[`gpt_image_1_5` | `gpt_image_1_mini`],
  size: AiImageSize,
) => {
  const { low, medium } = tiers;

  switch (size) {
    case `256x256`: {
      return low.rubPerImage1024x1024;
    }
    case `512x512`: {
      return low.rubPerImage1536x1024;
    }
    case `1024x1024`: {
      return medium.rubPerImage1024x1024;
    }
    case `1024x1792`:
    case `1792x1024`: {
      return medium.rubPerImage1536x1024;
    }
    default: {
      return medium.rubPerImage1024x1024;
    }
  }
};

const imageRubFromReportedTokens = (totalTokens: number) => {
  const imageUsageRubPerMillion = 400;

  return Math.max(
    (totalTokens / perMillion) * imageUsageRubPerMillion,
    ProxyApiCostMinimums.imageFromReportedTokensRub,
  );
};

const image = (modelId: ProxyApiImageCostModelId, options: ProxyApiImageCostOptions) => {
  const { size, totalTokens } = options;

  switch (modelId) {
    case `dall-e-3`: {
      return totalTokens > 0 ? imageRubFromReportedTokens(totalTokens) : dallE3RubForSize(size);
    }
    case `gemini-3.1-flash-image-preview`: {
      const { approxRubPerImage1K, rubImageOutputPerMillionTokens } =
        ProxyApiPriceList.image.gemini_3_1_flash_image_preview;

      return totalTokens > 0 ? (totalTokens / perMillion) * rubImageOutputPerMillionTokens : approxRubPerImage1K;
    }
    case `gpt-image-1-mini`: {
      return totalTokens > 0
        ? imageRubFromReportedTokens(totalTokens)
        : gptImageLowMediumRubForSize(ProxyApiPriceList.image.gpt_image_1_mini, size);
    }
    case `gpt-image-1.5`: {
      return totalTokens > 0
        ? imageRubFromReportedTokens(totalTokens)
        : gptImageLowMediumRubForSize(ProxyApiPriceList.image.gpt_image_1_5, size);
    }
    default: {
      const x: never = modelId;

      return x;
    }
  }
};

const speechRub = (options: ProxyApiSpeechCostOptions, rubPerMinute: number) => {
  const secondsPerMinute = 60;
  const speechPromptTokPerSecondEstimate = 50;
  const { audioSeconds, byteLength, completionTok, promptTok } = options;

  if (promptTok > 0 || completionTok > 0) {
    const minutesFromTok = Math.max(
      promptTok / speechPromptTokPerSecondEstimate / secondsPerMinute,
      ProxyApiCostMinimums.speechBilledMinutes,
    );

    return Math.max(rubPerMinute * minutesFromTok, ProxyApiCostMinimums.speechRub);
  }

  if (audioSeconds > 0) {
    const minutes = Math.max(audioSeconds / secondsPerMinute, ProxyApiCostMinimums.speechBilledMinutes);

    return Math.max(rubPerMinute * minutes, ProxyApiCostMinimums.speechRub);
  }

  const pcmSampleRateHz = 16_000;
  const pcmStereoBytesPerSecond = pcmSampleRateHz * 2;

  const fallbackMinutes = Math.max(
    byteLength / (pcmStereoBytesPerSecond * secondsPerMinute),
    ProxyApiCostMinimums.speechBilledMinutes,
  );

  return Math.max(rubPerMinute * fallbackMinutes, ProxyApiCostMinimums.speechRub);
};

const speech = (modelId: ProxyApiSpeechCostModelId, options: ProxyApiSpeechCostOptions) => {
  const pricesKey = speechApiModelToPricesKey[modelId];

  return speechRub(options, ProxyApiPriceList.speechRecognition[pricesKey].rubPerMinuteIncomingAudio);
};

export const ProxyApiCostCalculator = (priceMultiplier: number) => {
  const debitRub = (providerRub: number) => providerRub * priceMultiplier;

  return {
    chat: (modelId: ProxyApiChatCostModelId, options: ProxyApiChatCostOptions) => debitRub(chat(modelId, options)),
    image: (modelId: ProxyApiImageCostModelId, options: ProxyApiImageCostOptions) => debitRub(image(modelId, options)),
    speech: (modelId: ProxyApiSpeechCostModelId, options: ProxyApiSpeechCostOptions) =>
      debitRub(speech(modelId, options)),
  };
};

export type ProxyApiCostCalculator = ReturnType<typeof ProxyApiCostCalculator>;
