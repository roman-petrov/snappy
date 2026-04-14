/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import openai from "openai";

import type { AiGenericModel, AiModelProvider } from "../Types";

import { OpenAiChatModel, OpenAiEmbedderModel, OpenAiImageModel, OpenAiSpeechRecognitionModel } from "../core";
import { AiTunnelCost, AiTunnelUrls } from "./core";

type AiTunnelChatModelRaw = { hidden?: boolean };

type AiTunnelEmbeddingModelRaw = { hidden?: boolean };

type AiTunnelImageModelRaw = Record<string, unknown>;

type AiTunnelModelsResponse = {
  chat?: Record<string, AiTunnelChatModelRaw>;
  embeddings?: Record<string, AiTunnelEmbeddingModelRaw>;
  images?: Record<string, AiTunnelImageModelRaw>;
  transcriptions?: Record<string, AiTunnelTranscriptionModelRaw>;
};

type AiTunnelTranscriptionModelRaw = Record<string, unknown>;

export const AiTunnel: AiModelProvider = async ({ apiKey, baseUrl, locale }) => {
  const parseVisibleNames = <T extends { hidden?: boolean }>(group: Record<string, T> | undefined) =>
    _.entries(group ?? {})
      .filter(([, value]) => value.hidden !== true)
      .map(([name]) => name);

  const parseAllNames = <T>(group: Record<string, T> | undefined) => _.keys(group ?? {});

  const fetchModels = async (): Promise<AiTunnelModelsResponse> => {
    const response = await fetch(AiTunnelUrls.publicModelsUrl);
    if (!response.ok) {
      throw new Error(`ai_tunnel_models_fetch_failed`);
    }

    return (await response.json()) as AiTunnelModelsResponse;
  };

  const rawModels = await fetchModels();
  const chatModels = parseVisibleNames(rawModels.chat);
  const embeddingModels = parseVisibleNames(rawModels.embeddings);
  const imageModels = parseAllNames(rawModels.images);
  const transcriptionModels = parseAllNames(rawModels.transcriptions);
  const costs = AiTunnelCost;
  const client = new openai({ apiKey: apiKey ?? `none`, baseURL: baseUrl, dangerouslyAllowBrowser: true });

  return [
    ...chatModels.map(name => OpenAiChatModel({ cost: costs.chat, locale, name })(client)),
    ...embeddingModels.map(name => OpenAiEmbedderModel({ cost: costs.embedder, name })(client)),
    ...transcriptionModels.map(name => OpenAiSpeechRecognitionModel({ cost: costs.speechRecognition, name })(client)),
    ...imageModels.map(name => OpenAiImageModel({ cost: costs.image, name })(client)),
  ].map((model: AiGenericModel) => ({ ...model, source: `ai-tunnel` as const }));
};
