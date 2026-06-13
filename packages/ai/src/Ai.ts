import type { AiHttpConfig } from "./AiHttp";
import type {
  AiAudioTranscriptionsCreateInput,
  AiChatCompletionCreateInput,
  AiEmbeddingsCreateInput,
  AiImageEditInput,
  AiImageGenerateInput,
} from "./Types";

import { AiAudio } from "./AiAudio";
import { AiChat } from "./AiChat";
import { AiEmbeddings } from "./AiEmbeddings";
import { AiImages } from "./AiImages";
import { AiModels } from "./AiModels";
import { AiTunnel } from "./AiTunnel";

export type AiConnectionOptions = AiKeyPart | AiUrlPart;

export type AiKeyPart = { aiTunnelKey: string };

export type AiOptions = AiConnectionOptions;

export type AiUrlPart = { url: string };

export const Ai = (options: AiOptions) => {
  const http: AiHttpConfig =
    `url` in options
      ? { apiKey: `none`, baseUrl: AiTunnel.baseUrl(options.url) }
      : { apiKey: options.aiTunnelKey, baseUrl: AiTunnel.baseUrl() };

  const models = AiModels.items;
  const transcriptionsCreate = async (input: AiAudioTranscriptionsCreateInput) => AiAudio.transcription(http, input);
  const embeddingsCreate = async (input: AiEmbeddingsCreateInput) => AiEmbeddings.create(http, input);
  const imagesEdit = async (input: AiImageEditInput) => AiImages.edit(http, input);
  const imagesGenerate = async (input: AiImageGenerateInput) => AiImages.generate(http, input);
  const completionsCreate = (input: AiChatCompletionCreateInput) => AiChat.completion(http, input);

  return {
    audio: { transcriptions: { create: transcriptionsCreate } },
    chat: { completions: { create: completionsCreate } },
    embeddings: { create: embeddingsCreate },
    images: { edit: imagesEdit, generate: imagesGenerate },
    models,
  };
};

export type Ai = ReturnType<typeof Ai>;
