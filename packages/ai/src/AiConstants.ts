export const AiConstants = {
  defaults: {
    imageQuality: `low`,
    models: {
      chat: `gpt-5-nano`,
      embedder: `text-embedding-3-small`,
      image: `gpt-image-1-mini`,
      speechRecognition: `whisper-1`,
    },
  },
  imageQuality: [`auto`, `hd`, `high`, `low`, `medium`, `standard`] as const,
  imageSize: [`256x256`, `512x512`, `1024x1024`, `1024x1792`, `1792x1024`] as const,
  maxImagePromptLength: 3000,
  maxSpeechFileMegaBytes: 25,
  maxToolSteps: 16,
} as const;
