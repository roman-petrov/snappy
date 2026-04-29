// cspell:word pplx
/* eslint-disable functional/no-promise-reject */

import { _ } from "@snappy/core";
import openai, { toFile } from "openai";

import type {
  AiAudioTranscriptionsCreateInput,
  AiChatCompletionCreateInput,
  AiChatCompletionSession,
  AiEmbeddingsCreateInput,
  AiImageGenerateInput,
  AiLocale,
  AiModelListItem,
} from "./Types";

import { chatCompletionStream } from "./ChatCompletionStream";
import { SystemPrompt } from "./SystemPrompt";

const maxImagePromptLength = 3000;
const maxSpeechFileMegaBytes = 25;
const openAiBaseUrlDefault = `https://api.aitunnel.ru/v1`;
const publicModelsUrl = `https://api.aitunnel.ru/public/aitunnel/models`;

const openAiBaseUrl = (baseUrl?: string) =>
  baseUrl === undefined ? openAiBaseUrlDefault : baseUrl.replace(/\/$/u, ``);

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

const parseVisibleNames = <T extends { hidden?: boolean }>(group: Record<string, T> | undefined) =>
  _.entries(group ?? {})
    .filter(([, value]) => value.hidden !== true)
    .map(([name]) => name);

const parseAllNames = <T>(group: Record<string, T> | undefined) => _.keys(group ?? {});

const fetchModels = async (): Promise<AiTunnelModelsResponse> => {
  const response = await fetch(publicModelsUrl);
  if (!response.ok) {
    throw new Error(`ai_tunnel_models_fetch_failed`);
  }

  return (await response.json()) as AiTunnelModelsResponse;
};

const listModels = async (): Promise<AiModelListItem[]> => {
  const rawModels = await fetchModels();
  const chatModels = parseVisibleNames(rawModels.chat);
  const embeddingModels = parseVisibleNames(rawModels.embeddings);
  const imageModels = parseAllNames(rawModels.images);
  const transcriptionModels = parseAllNames(rawModels.transcriptions);

  return [
    ...chatModels.map(name => ({ name, source: `ai-tunnel`, type: `chat` as const })),
    ...embeddingModels.map(name => ({ name, source: `ai-tunnel`, type: `embedder` as const })),
    ...transcriptionModels.map(name => ({ name, source: `ai-tunnel`, type: `speech-recognition` as const })),
    ...imageModels.map(name => ({ name, source: `ai-tunnel`, type: `image` as const })),
  ];
};

export type AiConnectionOptions = AiKeyPart | AiUrlPart;

export type AiKeyPart = { aiTunnelKey: string; url?: never };

export type AiOptions = AiConnectionOptions & { locale: AiLocale };

export type AiUrlPart = { aiTunnelKey?: never; url: string };

export const Ai = async (options: AiOptions) => {
  const baseUrl = `aiTunnelKey` in options ? openAiBaseUrl() : openAiBaseUrl(options.url);
  const { locale } = options;

  const client = new openai({
    apiKey: `aiTunnelKey` in options ? options.aiTunnelKey : `none`,
    baseURL: baseUrl,
    dangerouslyAllowBrowser: true,
  });

  const models = await listModels();

  const cost = (usage: unknown) => {
    const value = usage as undefined | { cost_rub?: number };
    if (!_.isNumber(value?.cost_rub)) {
      throw new TypeError(`ai_cost_missing`);
    }

    return value.cost_rub;
  };

  const api = {
    audio: {
      transcriptions: {
        create: async ({ file, model }: AiAudioTranscriptionsCreateInput) => {
          const rawFile = await toFile(new Uint8Array(file.bytes), file.fileName, { type: file.mimeType });

          const transcription = await client.audio.transcriptions.create({
            file: rawFile,
            model,
            response_format: `json`,
          });

          return { cost: cost(transcription.usage), text: transcription.text };
        },
      },
    },
    chat: {
      completions: {
        create: async ({ model, ...input }: AiChatCompletionCreateInput) => {
          const sourceMessages =
            `prompt` in input ? [{ content: input.prompt, role: `user` as const }] : input.messages;

          const messages = [{ content: SystemPrompt(locale), role: `system` as const }, ...sourceMessages].map(
            message =>
              message.role === `assistant`
                ? (() => {
                    const { toolCalls, ...rest } = message;

                    return {
                      ...rest,
                      tool_calls: toolCalls?.map(call => ({
                        function: {
                          arguments: _.isString(call.function.arguments)
                            ? call.function.arguments
                            : JSON.stringify(call.function.arguments ?? {}),
                          name: call.function.name,
                        },
                        id: call.id,
                        type: `function` as const,
                      })),
                    };
                  })()
                : message.role === `tool`
                  ? { content: message.content, role: `tool` as const, tool_call_id: message.toolCallId }
                  : { content: message.content, role: message.role },
          );

          const streamRunner = client.chat.completions.stream({
            ...(`prompt` in input
              ? {}
              : {
                  tool_choice:
                    input.toolChoice === undefined || input.toolChoice === `auto` || input.toolChoice === `none`
                      ? input.toolChoice
                      : { function: { name: input.toolChoice.name }, type: `function` as const },
                  tools: input.tools?.map(tool => ({ ...tool, type: `function` as const })),
                }),
            messages,
            model,
          });

          type StreamRunnerWithFinal = typeof streamRunner;

          let completionOnce: ReturnType<StreamRunnerWithFinal[`finalChatCompletion`]> | undefined;

          const finalCompletion = async () => {
            completionOnce ??= streamRunner.finalChatCompletion();

            return completionOnce;
          };

          const stream = chatCompletionStream(streamRunner, finalCompletion);
          const session: AiChatCompletionSession = { cost: async () => cost((await finalCompletion()).usage), stream };

          return session;
        },
      },
    },
    embeddings: {
      create: async ({ input, model }: AiEmbeddingsCreateInput) => {
        const { data, usage } = await client.embeddings.create({ input, model });

        return { cost: cost(usage), vectors: data.map(item => item.embedding) };
      },
    },
    images: {
      generate: async ({ model, prompt, quality, size }: AiImageGenerateInput) => {
        const raw = await client.images.generate({
          model,
          n: 1,
          prompt,
          ...(quality === undefined ? {} : { quality }),
          size,
        });

        const first = raw.data?.[0];
        if (first === undefined) {
          throw new Error(`openai_image_invalid`);
        }
        const costValue = cost(raw.usage);
        if (first.url !== undefined && first.url.length > 0) {
          const response = await fetch(first.url);
          if (!response.ok) {
            throw new Error(`openai_image_url_fetch`);
          }

          return { bytes: new Uint8Array(await response.arrayBuffer()), cost: costValue };
        }
        if (first.b64_json !== undefined && first.b64_json.length > 0) {
          return { bytes: Uint8Array.fromBase64(first.b64_json), cost: costValue };
        }
        throw new Error(`openai_image_invalid`);
      },
    },
    models: { list: () => models },
  };

  return {
    ...api,
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
  };
};

export type Ai = Awaited<ReturnType<typeof Ai>>;
