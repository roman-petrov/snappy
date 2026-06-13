import type { AiHttpConfig } from "./AiHttp";
import type { AiChatModel, AiEmbedderModel, AiImageModel, AiSpeechModel } from "./core-model";
import type { AiModelEntry } from "./core-model/Entry";

import { AiModels } from "./AiModel";
import { AiTunnel } from "./AiTunnel";
import { AiModelChatCatalog, AiModelEmbedderCatalog, AiModelImageCatalog, AiModelSpeechCatalog } from "./models";

export type AiConnectionOptions = AiKeyPart | AiUrlPart;

export type AiDefaults = {
  chat: AiChatModel;
  embedder: AiEmbedderModel;
  image: AiImageModel;
  speech: AiSpeechModel;
  vision: AiChatModel;
};

export type AiKeyPart = { aiTunnelKey: string };

export type AiOptions = AiConnectionOptions;

export type AiUrlPart = { url: string };

type BoundEntry<Bound> = AiModelEntry & { of: (http: AiHttpConfig) => Bound };

const bind =
  <Bound>(entries: readonly BoundEntry<Bound>[], fallback: BoundEntry<Bound>, http: AiHttpConfig) =>
  (modelId: string): Bound =>
    (entries.find(entry => entry.matches(modelId)) ?? fallback).of(http);

export const Ai = (options: AiOptions) => {
  const http: AiHttpConfig =
    `url` in options
      ? { apiKey: `none`, baseUrl: AiTunnel.baseUrl(options.url) }
      : { apiKey: options.aiTunnelKey, baseUrl: AiTunnel.baseUrl() };

  const { fallback } = AiModels;

  const defaults: AiDefaults = {
    chat: fallback.chat.of(http),
    embedder: fallback.embedder.of(http),
    image: fallback.image.of(http),
    speech: fallback.speechRecognition.of(http),
    vision: fallback.vision.of(http),
  };

  return {
    chat: bind<AiChatModel>(AiModelChatCatalog, fallback.chat, http),
    defaults,
    embedder: bind<AiEmbedderModel>(AiModelEmbedderCatalog, fallback.embedder, http),
    image: bind<AiImageModel>(AiModelImageCatalog, fallback.image, http),
    speech: bind<AiSpeechModel>(AiModelSpeechCatalog, fallback.speechRecognition, http),
    vision: bind<AiChatModel>(AiModelChatCatalog, fallback.vision, http),
  };
};

export type Ai = ReturnType<typeof Ai>;
