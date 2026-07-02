const gptImage = [`1024x1024`, `1024x1536`, `1536x1024`] as const;

const gemini = [
  `1024x1024`,
  `832x1248`,
  `1248x832`,
  `864x1184`,
  `1184x864`,
  `896x1152`,
  `1152x896`,
  `768x1344`,
  `1344x768`,
  `1536x672`,
] as const;

const imageAspectRatio = [`1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`] as const;
const imageAspectRatioExtended = [`1:4`, `4:1`, `1:8`, `8:1`] as const;
const imageResolution = [`0.5K`, `1K`, `2K`, `4K`] as const;

export const AiConstants = {
  defaults: { imageQuality: `low`, imageSize: `1024x1024` },
  imageAspectRatio,
  imageAspectRatioExtended,
  imageConfigPreset: {
    gemini: { aspectRatios: imageAspectRatio, resolutions: [`1K`, `2K`, `4K`] as const },
    geminiFlash: { aspectRatios: [...imageAspectRatio, ...imageAspectRatioExtended], resolutions: imageResolution },
  },
  imageQuality: [`auto`, `hd`, `high`, `low`, `medium`, `standard`] as const,
  imageResolution,
  imageSizePreset: { gemini, gptImage },
  maxChatTokens: 50_000,
  maxImagePromptLength: 3000,
  maxSpeechFileMegaBytes: 25,
} as const;
