export const AiConstants = {
  defaults: { imageQuality: `low` },
  imageQuality: [`auto`, `hd`, `high`, `low`, `medium`, `standard`] as const,
  imageSize: [`256x256`, `512x512`, `1024x1024`, `1024x1792`, `1792x1024`] as const,
  maxChatTokens: 50_000,
  maxImagePromptLength: 3000,
  maxSpeechFileMegaBytes: 25,
} as const;
