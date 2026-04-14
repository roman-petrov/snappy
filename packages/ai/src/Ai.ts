import type { AiLocale } from "./Types";

// cspell:word pplx
import { AiTunnel } from "./ai-tunnel";
import { AiTunnelUrls } from "./ai-tunnel/core";

const maxImagePromptLength = 3000;
const maxSpeechFileMegaBytes = 25;

export type AiOptions = AiByKey | AiByUrl;

type AiBase = { locale: AiLocale };

type AiByKey = AiBase & { aiTunnelKey: string; url?: never };

type AiByUrl = AiBase & { aiTunnelKey?: never; url: string };

export const Ai = async (options: AiOptions) => {
  const baseUrl = `aiTunnelKey` in options ? AiTunnelUrls.openAi() : AiTunnelUrls.openAi(options.url);
  const apiKey = `aiTunnelKey` in options ? options.aiTunnelKey : undefined;

  return {
    defaults: {
      imageQuality: `low` as const,
      models: {
        chat: `gpt-5-nano`,
        embedder: `pplx-embed-v1-0.6b`,
        image: `gpt-image-1-mini`,
        speechRecognition: `whisper-1`,
      },
    },
    maxImagePromptLength,
    maxSpeechFileMegaBytes,
    models: await AiTunnel({ apiKey, baseUrl, locale: options.locale }),
  };
};

export type Ai = Awaited<ReturnType<typeof Ai>>;
