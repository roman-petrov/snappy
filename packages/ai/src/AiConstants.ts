export const AiConstants = {
  imageQuality: [`auto`, `hd`, `high`, `low`, `medium`, `standard`] as const,
  imageSize: [`256x256`, `512x512`, `1024x1024`, `1024x1792`, `1792x1024`] as const,
} as const;
