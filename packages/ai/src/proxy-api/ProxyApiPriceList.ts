// cspell:word dall

/**
 * Numeric ProxyAPI tariffs from https://proxyapi.ru/pricing and https://proxyapi.ru/pricing/list.
 * Snappy-connected models only; refresh when the site prices change.
 */

type ProxyApiChatModelPrices = {
  rubCacheReadPerMillion: number;
  rubInputPerMillion: number;
  rubOutputPerMillion: number;
};

type ProxyApiDallE2PerImageRub = {
  rubPerImage256x256: number;
  rubPerImage512x512: number;
  rubPerImage1024x1024: number;
};

type ProxyApiDallE3PerImageRub = { rubPerImage1024x1024: number; rubPerImage1024x1792Or1792x1024: number };

type ProxyApiGeminiFlashImagePrices = { approxRubPerImage1K: number; rubImageOutputPerMillionTokens: number };

type ProxyApiGptImageLowMediumPrices = {
  low: { rubPerImage1024x1024: number; rubPerImage1536x1024: number };
  medium: { rubPerImage1024x1024: number; rubPerImage1536x1024: number };
};

/* eslint-disable @typescript-eslint/naming-convention -- keys match ProxyAPI model ids */
type ProxyApiPriceListShape = {
  chat: {
    gpt_5_4_mini: ProxyApiChatModelPrices;
    gpt_5_4_nano: ProxyApiChatModelPrices;
    gpt_5_mini: ProxyApiChatModelPrices;
  };
  image: {
    dall_e_2: ProxyApiDallE2PerImageRub;
    dall_e_3: ProxyApiDallE3PerImageRub;
    gemini_3_1_flash_image_preview: ProxyApiGeminiFlashImagePrices;
    gpt_image_1_5: ProxyApiGptImageLowMediumPrices;
    gpt_image_1_mini: ProxyApiGptImageLowMediumPrices;
  };
  speechRecognition: {
    gpt_4o_transcribe: { rubPerMinuteIncomingAudio: number };
    whisper_1: { rubPerMinuteIncomingAudio: number };
  };
};
/* eslint-enable @typescript-eslint/naming-convention */

export const ProxyApiPriceList = {
  chat: {
    gpt_5_4_mini: { rubCacheReadPerMillion: 23, rubInputPerMillion: 230, rubOutputPerMillion: 1370 },
    gpt_5_4_nano: { rubCacheReadPerMillion: 6, rubInputPerMillion: 61, rubOutputPerMillion: 380 },
    gpt_5_mini: { rubCacheReadPerMillion: 6.45, rubInputPerMillion: 65, rubOutputPerMillion: 516 },
  },
  image: {
    dall_e_2: { rubPerImage256x256: 4.13, rubPerImage512x512: 4.64, rubPerImage1024x1024: 5.16 },
    dall_e_3: { rubPerImage1024x1024: 11, rubPerImage1024x1792Or1792x1024: 21 },
    gemini_3_1_flash_image_preview: { approxRubPerImage1K: 20.4, rubImageOutputPerMillionTokens: 18_200 },
    gpt_image_1_5: {
      low: { rubPerImage1024x1024: 2.73, rubPerImage1536x1024: 3.95 },
      medium: { rubPerImage1024x1024: 11, rubPerImage1536x1024: 16 },
    },
    gpt_image_1_mini: {
      low: { rubPerImage1024x1024: 0.67, rubPerImage1536x1024: 1.01 },
      medium: { rubPerImage1024x1024: 2.69, rubPerImage1536x1024: 4.03 },
    },
  },
  speechRecognition: {
    gpt_4o_transcribe: { rubPerMinuteIncomingAudio: 1.55 },
    whisper_1: { rubPerMinuteIncomingAudio: 1.55 },
  },
} as const satisfies ProxyApiPriceListShape;
