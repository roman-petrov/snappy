/* eslint-disable no-continue */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createOpenAI } from "@ai-sdk/openai";
import { _ } from "@snappy/core";
import {
  embedMany,
  experimental_transcribe,
  generateImage,
  type ModelMessage,
  stepCountIs,
  streamText,
  type TextPart,
  tool,
  type ToolCallPart,
  type ToolResultPart,
} from "ai";

import type {
  AiAudioTranscriptionsCreateInput,
  AiChatCompletionCreateInput,
  AiChatCompletionSession,
  AiChatMessage,
  AiChatStream,
  AiChatStreamSegment,
  AiEmbeddingsCreateInput,
  AiImageGenerateInput,
  AiModelListItem,
  AiSessionStop,
  AiToolCall,
} from "./Types";

import { AiConstants } from "./AiConstants";

const requireCost = (cost: number | undefined) => {
  if (cost === undefined) {
    throw new TypeError(`ai_cost_missing`);
  }

  return cost;
};

const costRubFromProvider = (value: unknown) => {
  if (value === null || !_.isObject(value)) {
    return undefined;
  }
  const direct = (value as { cost_rub?: unknown }).cost_rub;
  if (_.isNumber(direct)) {
    return direct;
  }
  const { openai } = value as { openai?: unknown };
  if (openai !== null && _.isObject(openai)) {
    const nested = (openai as { cost_rub?: unknown }).cost_rub;
    if (_.isNumber(nested)) {
      return nested;
    }
  }

  return undefined;
};

const costRubDeep = (root: unknown) => {
  const seen = new Set<unknown>();

  const walk = (node: unknown): number | undefined => {
    if (node === null || node === undefined) {
      return undefined;
    }
    if (!_.isObject(node)) {
      return undefined;
    }
    if (seen.has(node)) {
      return undefined;
    }
    seen.add(node);
    const direct = costRubFromProvider(node);
    if (direct !== undefined) {
      return direct;
    }
    const fromUsage = costRubFromProvider((node as { usage?: unknown }).usage);
    if (fromUsage !== undefined) {
      return fromUsage;
    }
    for (const value of Object.values(node as Record<string, unknown>)) {
      const nested = walk(value);
      if (nested !== undefined) {
        return nested;
      }
    }

    return undefined;
  };

  return walk(root);
};

const tunnelCostOptional = (bundle: { providerMetadata?: unknown; usage?: unknown }) =>
  costRubFromProvider(bundle.usage) ?? costRubFromProvider(bundle.providerMetadata) ?? costRubDeep(bundle);

const costFromAiTunnel = (bundle: { providerMetadata?: unknown; usage?: unknown }) =>
  requireCost(tunnelCostOptional(bundle));

const embedCostFromSdk = (result: {
  providerMetadata?: unknown;
  responses?: readonly (undefined | { body?: unknown })[];
}) => {
  const fromResponses = (result.responses ?? [])
    .map(response => costRubDeep(response?.body))
    .filter((cost): cost is number => cost !== undefined);

  if (fromResponses.length > 0) {
    return fromResponses.reduce((sum, cost) => sum + cost, 0);
  }

  return costFromAiTunnel({ providerMetadata: result.providerMetadata });
};

const toolResultText = (part: ToolResultPart) => {
  const { output } = part;
  if (output.type === `text`) {
    return output.value;
  }

  return JSON.stringify(output);
};

const modelMessageText = (content: ModelMessage[`content`]) => {
  if (_.isString(content)) {
    return content;
  }
  if (!_.isArray(content)) {
    return ``;
  }

  return content
    .filter((part): part is TextPart => part.type === `text`)
    .map(part => part.text)
    .join(``);
};

const aiChatMessagesToModelMessages = (source: readonly AiChatMessage[]): ModelMessage[] =>
  source.map((message): ModelMessage => {
    if (message.role === `system` || message.role === `user`) {
      return { content: message.content, role: message.role };
    }
    if (message.role === `assistant`) {
      const calls = message.toolCalls;
      if (calls !== undefined && calls.length > 0) {
        const parts: (TextPart | ToolCallPart)[] = [];
        if (message.content.trim() !== ``) {
          parts.push({ text: message.content, type: `text` });
        }
        parts.push(
          ...calls.map(
            (call): ToolCallPart => ({
              input: call.input,
              toolCallId: call.toolCallId,
              toolName: call.toolName,
              type: `tool-call` as const,
            }),
          ),
        );

        return { content: parts, role: `assistant` };
      }

      return { content: message.content, role: `assistant` };
    }
    if (message.role === `tool`) {
      const toolName =
        source
          .filter((row): row is Extract<AiChatMessage, { role: `assistant` }> => row.role === `assistant`)
          .flatMap(row => row.toolCalls ?? [])
          .find(call => call.toolCallId === message.toolCallId)?.toolName ?? `tool`;

      return {
        content: [
          {
            output: { type: `text` as const, value: message.content },
            toolCallId: message.toolCallId,
            toolName,
            type: `tool-result` as const,
          },
        ],
        role: `tool`,
      };
    }

    throw new Error(`ai_unsupported_message`);
  });

const modelMessagesToAiChatMessages = (source: readonly ModelMessage[]): AiChatMessage[] =>
  source.flatMap((message): AiChatMessage[] => {
    if (message.role === `system` || message.role === `user`) {
      return [{ content: modelMessageText(message.content), role: message.role }];
    }
    if (message.role === `assistant`) {
      const content = modelMessageText(message.content);
      if (!_.isArray(message.content)) {
        return [{ content, role: `assistant` }];
      }
      const toolCalls = message.content
        .filter((part): part is ToolCallPart => part.type === `tool-call`)
        .map((call): AiToolCall => ({ input: call.input, toolCallId: call.toolCallId, toolName: call.toolName }));

      return [{ content, role: `assistant`, toolCalls: toolCalls.length > 0 ? toolCalls : undefined }];
    }
    if (message.role === `tool`) {
      if (!_.isArray(message.content)) {
        return [];
      }

      return message.content
        .filter((part): part is ToolResultPart => part.type === `tool-result`)
        .map(
          (part): Extract<AiChatMessage, { role: `tool` }> => ({
            content: toolResultText(part),
            role: `tool`,
            toolCallId: part.toolCallId,
          }),
        );
    }

    return [];
  });

const toolCallsFromSdkSteps = (
  steps: readonly { readonly staticToolCalls: readonly { input: unknown; toolCallId: string; toolName: string }[] }[],
) => {
  const raw = steps.at(-1)?.staticToolCalls ?? [];
  if (raw.length === 0) {
    return [];
  }

  return raw.map((call): AiToolCall => ({ input: call.input, toolCallId: call.toolCallId, toolName: call.toolName }));
};

const sdkPartText = (part: { delta?: unknown; text?: unknown }) => {
  const { delta, text } = part;
  if (_.isString(text) && text !== ``) {
    return text;
  }
  if (_.isString(delta) && delta !== ``) {
    return delta;
  }

  return ``;
};

const openAiDeltaFromRaw = (rawValue: unknown) => {
  if (rawValue === null || !_.isObject(rawValue)) {
    return undefined;
  }
  const choice = (rawValue as { choices?: unknown[] }).choices?.[0];
  if (choice === null || !_.isObject(choice)) {
    return undefined;
  }
  const { delta } = choice as { delta?: unknown };
  if (delta === null || !_.isObject(delta)) {
    return undefined;
  }

  return delta as { content?: unknown; reasoning?: unknown };
};

type StreamCell<T> = { close: () => void; push: (value: T) => void; stream: AsyncIterable<T> };

const streamCell = <T>() => {
  const buffer: T[] = [];
  let notify: (() => void) | undefined;
  let closed = false;

  const wait = async () =>
    new Promise<void>(resolve => {
      notify = resolve;
    });

  const stream = (async function* cellStream() {
    for (;;) {
      while (buffer.length > 0) {
        const value = buffer.shift();
        if (value === undefined) {
          break;
        }
        yield value;
      }
      if (closed) {
        return;
      }
      await wait();
      notify = undefined;
    }
  })();

  const resume = () => {
    const wake = notify;
    notify = undefined;
    wake?.();
  };

  const close = () => {
    closed = true;
    resume();
  };

  const push = (value: T) => {
    buffer.push(value);
    resume();
  };

  return { close, push, stream };
};

const streamStopped = <T>(source: AsyncIterable<T>, stop?: AiSessionStop): AsyncIterable<T> =>
  (async function* stoppedStream() {
    for await (const value of source) {
      if (stop?.() === true) {
        return;
      }
      yield value;
    }
  })();

const textFromSegments = (
  segments: AiChatStream,
  type: Extract<AiChatStreamSegment, { type: `chat` | `reasoning` }>[`type`],
  stop?: AiSessionStop,
): AsyncIterable<string> =>
  (async function* segmentText() {
    for await (const segment of streamStopped(segments, stop)) {
      if (segment.type !== type) {
        continue;
      }
      for await (const text of streamStopped(segment.stream, stop)) {
        if (text !== ``) {
          yield text;
        }
      }
    }
  })();

const chatStreamFromSdk = (
  result: {
    fullStream: AsyncIterable<{ delta?: string; text?: unknown; type: string }>;
    steps: PromiseLike<
      readonly { readonly staticToolCalls: readonly { input: unknown; toolCallId: string; toolName: string }[] }[]
    >;
  },
  tunnelCostFromStream: { last?: number },
): AiChatStream =>
  (async function* mux() {
    const segmentOut = streamCell<AiChatStreamSegment>();

    const enqueue = (segment: AiChatStreamSegment) => {
      segmentOut.push(segment);
    };

    let chatCell: StreamCell<string> | undefined;
    let reasoningCell: StreamCell<string> | undefined;
    let pending: string | undefined;
    const toolRows = new Map<string, { cell: StreamCell<AiToolCall>; finalized: boolean }>();
    const callsEmitted = new Set<string>();

    const closeTextStreams = () => {
      chatCell?.close();
      chatCell = undefined;
      if (reasoningCell !== undefined) {
        reasoningCell.close();
        reasoningCell = undefined;
      }
    };

    const pushReasoningText = (text: string) => {
      if (text === ``) {
        return;
      }
      if (reasoningCell === undefined) {
        chatCell?.close();
        chatCell = undefined;
        reasoningCell = streamCell<string>();
        enqueue({ stream: reasoningCell.stream, type: `reasoning` });
      }
      reasoningCell.push(text);
    };

    const pushUserText = (text: string) => {
      if (text === ``) {
        return;
      }
      if (reasoningCell !== undefined) {
        reasoningCell.close();
        reasoningCell = undefined;
      }
      if (chatCell === undefined) {
        chatCell = streamCell<string>();
        enqueue({ stream: chatCell.stream, type: `chat` });
      }
      chatCell.push(text);
    };

    const flushPendingAsFinal = () => {
      if (pending === undefined) {
        return;
      }
      const last = pending.trimEnd();
      pending = undefined;
      if (last !== ``) {
        pushUserText(last);
      }
    };

    const advancePending = (delta: string) => {
      if (delta === ``) {
        return;
      }
      if (pending !== undefined) {
        pushUserText(pending);
      }
      pending = delta;
    };

    const endTextSegment = () => {
      flushPendingAsFinal();
      closeTextStreams();
    };

    const finalizeToolRow = (toolCallId: string, call: AiToolCall) => {
      if (callsEmitted.has(toolCallId)) {
        return;
      }
      const row = toolRows.get(toolCallId);
      if (row === undefined) {
        const cell = streamCell<AiToolCall>();
        cell.push(call);
        cell.close();
        enqueue({ stream: cell.stream, type: `tool` });
        callsEmitted.add(toolCallId);

        return;
      }
      if (!row.finalized) {
        row.cell.push(call);
        row.finalized = true;
        callsEmitted.add(toolCallId);
      }
      row.cell.close();
      toolRows.delete(toolCallId);
    };

    const noteStreamCost = (streamPart: unknown) => {
      if (streamPart === null || !_.isObject(streamPart)) {
        return;
      }
      const typed = streamPart as { rawValue?: unknown; type?: string };

      const cost =
        typed.type === `raw`
          ? costRubDeep(typed.rawValue)
          : typed.type === `finish-step`
            ? costRubDeep(streamPart)
            : undefined;
      if (cost !== undefined) {
        tunnelCostFromStream.last = cost;
      }
    };

    const pump = async () => {
      for await (const part of result.fullStream) {
        noteStreamCost(part);
        const streamPart = part as {
          delta?: unknown;
          id?: unknown;
          input?: unknown;
          rawValue?: unknown;
          reasoning?: unknown;
          text?: unknown;
          toolCallId?: unknown;
          toolName?: unknown;
          type: string;
        };

        switch (streamPart.type) {
          case `raw`: {
            const delta = openAiDeltaFromRaw(streamPart.rawValue);
            const reasoning = delta?.reasoning;
            if (_.isString(reasoning) && reasoning !== ``) {
              pushReasoningText(reasoning);
            }
            break;
          }
          case `reasoning-delta`: {
            const reasoningText = sdkPartText(streamPart);
            if (reasoningText !== ``) {
              pushReasoningText(reasoningText);
            }
            break;
          }
          case `text-delta`: {
            const { reasoning } = streamPart;
            if (_.isString(reasoning) && reasoning !== ``) {
              pushReasoningText(reasoning);
            }
            advancePending(sdkPartText(streamPart));
            break;
          }
          case `text-end`: {
            flushPendingAsFinal();
            if (reasoningCell !== undefined) {
              reasoningCell.close();
              reasoningCell = undefined;
            }
            break;
          }
          case `tool-call`: {
            if (!_.isString(streamPart.toolCallId) || streamPart.toolCallId === ``) {
              continue;
            }
            endTextSegment();
            finalizeToolRow(streamPart.toolCallId, {
              input: streamPart.input === undefined ? {} : streamPart.input,
              toolCallId: streamPart.toolCallId,
              toolName: _.isString(streamPart.toolName) ? streamPart.toolName : ``,
            });
            break;
          }
          case `tool-input-start`: {
            endTextSegment();
            if (!_.isString(streamPart.id) || streamPart.id === ``) {
              continue;
            }
            const cell = streamCell<AiToolCall>();
            toolRows.set(streamPart.id, { cell, finalized: false });
            enqueue({ stream: cell.stream, type: `tool` });
            break;
          }
          // No default
        }
      }

      flushPendingAsFinal();
      if (reasoningCell !== undefined) {
        reasoningCell.close();
        reasoningCell = undefined;
      }
      chatCell?.close();
      chatCell = undefined;

      const steps = await result.steps;
      const calls = toolCallsFromSdkSteps(steps);
      for (const [id, row] of toolRows.entries()) {
        if (!row.finalized) {
          const call = calls.find(toolCall => toolCall.toolCallId === id);
          if (call !== undefined) {
            row.cell.push(call);
            callsEmitted.add(id);
          }
        }
        row.cell.close();
        toolRows.delete(id);
      }
      for (const call of calls) {
        if (!callsEmitted.has(call.toolCallId)) {
          const cell = streamCell<AiToolCall>();
          cell.push(call);
          cell.close();
          enqueue({ stream: cell.stream, type: `tool` });
          callsEmitted.add(call.toolCallId);
        }
      }
    };

    void pump().finally(() => {
      segmentOut.close();
    });

    for await (const segment of segmentOut.stream) {
      yield segment;
    }
  })();

const openAiBaseUrlDefault = `https://api.aitunnel.ru/v1`;
const publicModelsUrl = `https://api.aitunnel.ru/public/aitunnel/models`;

const openAiBaseUrl = (baseUrl?: string) =>
  baseUrl === undefined ? openAiBaseUrlDefault : baseUrl.replace(/\/$/u, ``);

type AiTunnelModelsResponse = {
  chat?: Record<string, { hidden?: boolean }>;
  embeddings?: Record<string, { hidden?: boolean }>;
  images?: Record<string, unknown>;
  transcriptions?: Record<string, unknown>;
};

const modelNames = (group: Record<string, { hidden?: boolean }> | undefined, visibleOnly = false) =>
  _.entries(group ?? {})
    .filter(([, model]) => !visibleOnly || model.hidden !== true)
    .map(([name]) => name);

const listModels = async (): Promise<AiModelListItem[]> => {
  const response = await fetch(publicModelsUrl);
  if (!response.ok) {
    throw new Error(`ai_tunnel_models_fetch_failed`);
  }
  const rawModels = (await response.json()) as AiTunnelModelsResponse;
  const chatModels = modelNames(rawModels.chat, true);
  const embeddingModels = modelNames(rawModels.embeddings, true);
  const imageModels = modelNames(rawModels.images as Record<string, { hidden?: boolean }> | undefined);
  const transcriptionModels = modelNames(rawModels.transcriptions as Record<string, { hidden?: boolean }> | undefined);

  return [
    ...chatModels.map(name => ({ name, source: `ai-tunnel`, type: `chat` as const })),
    ...embeddingModels.map(name => ({ name, source: `ai-tunnel`, type: `embedder` as const })),
    ...transcriptionModels.map(name => ({ name, source: `ai-tunnel`, type: `speech-recognition` as const })),
    ...imageModels.map(name => ({ name, source: `ai-tunnel`, type: `image` as const })),
  ];
};

export type AiConnectionOptions = AiKeyPart | AiUrlPart;

export type AiKeyPart = { aiTunnelKey: string; url?: never };

export type AiOptions = AiConnectionOptions;

export type AiUrlPart = { aiTunnelKey?: never; url: string };

export const Ai = async (options: AiOptions) => {
  const baseUrl = `aiTunnelKey` in options ? openAiBaseUrl() : openAiBaseUrl(options.url);
  const apiKey = `aiTunnelKey` in options ? options.aiTunnelKey : `none`;
  const chatProvider = createOpenAI({ apiKey, baseURL: baseUrl });
  const models = await listModels();

  const api = {
    audio: {
      transcriptions: {
        create: async ({ file, model }: AiAudioTranscriptionsCreateInput) => {
          const audio = new Uint8Array(file.bytes);
          const result = await experimental_transcribe({ audio, model: chatProvider.transcription(model) });

          return {
            cost: requireCost(tunnelCostOptional({ providerMetadata: result.providerMetadata }) ?? costRubDeep(result)),
            text: result.text,
          };
        },
      },
    },
    chat: {
      completions: {
        create: ({ model, reasoningEffort, ...input }: AiChatCompletionCreateInput) => {
          const sourceMessages =
            `prompt` in input ? [{ content: input.prompt, role: `user` as const }] : input.messages;

          const modelInput = aiChatMessagesToModelMessages(sourceMessages);
          const chatInput = `prompt` in input ? undefined : input;

          const sdkTools =
            chatInput?.tools === undefined
              ? undefined
              : _.fromEntries(
                  _.entries(chatInput.tools).map(([name, definition]) => [
                    name,
                    tool({
                      description: definition.description,
                      execute: async input => {
                        const result = await definition.execute(input);

                        return _.isString(result) ? result : `Tool failed: ${result.error}`;
                      },
                      inputSchema: definition.inputSchema,
                    }),
                  ]),
                );

          const sdkToolChoice = (() => {
            if (chatInput === undefined) {
              return undefined;
            }
            const { toolChoice } = chatInput;
            if (toolChoice === undefined || toolChoice === `auto` || toolChoice === `none`) {
              return toolChoice;
            }

            return { toolName: toolChoice.name, type: `tool` as const };
          })();

          const tunnelCostFromStream: { last?: number } = {};

          const result = streamText({
            includeRawChunks: true,
            messages: modelInput,
            model: chatProvider.chat(model),
            onFinish: finish => {
              const cost = costRubDeep(finish);
              if (cost !== undefined) {
                tunnelCostFromStream.last = cost;
              }
            },
            ...(sdkTools === undefined ? {} : { toolChoice: sdkToolChoice, tools: sdkTools }),
            providerOptions: { openai: { reasoningEffort: reasoningEffort ?? `none` } },
            stopWhen: stepCountIs(AiConstants.maxToolSteps),
          });

          const stream = chatStreamFromSdk(result, tunnelCostFromStream);

          const session: AiChatCompletionSession = {
            assistant: async () => {
              const content = (await result.text).trimEnd();
              const toolCalls = toolCallsFromSdkSteps(await result.steps);

              return { content, role: `assistant` as const, toolCalls: toolCalls.length > 0 ? toolCalls : undefined };
            },
            chatText: stop => textFromSegments(stream, `chat`, stop),
            cost: async () =>
              requireCost(
                tunnelCostOptional({ providerMetadata: await result.providerMetadata, usage: await result.usage }) ??
                  tunnelCostFromStream.last ??
                  costRubDeep(await result.steps),
              ),
            messages: async () => {
              const response = await result.response;
              const delta = response.messages.slice(modelInput.length);

              return modelMessagesToAiChatMessages(delta);
            },
            reasoningText: stop => textFromSegments(stream, `reasoning`, stop),
            stream: stop => streamStopped(stream, stop),
          };

          return session;
        },
      },
    },
    embeddings: {
      create: async ({ input, model }: AiEmbeddingsCreateInput) => {
        const values = _.isArray(input) ? input : [input];
        const result = await embedMany({ model: chatProvider.embedding(model), values });

        return { cost: embedCostFromSdk(result), vectors: result.embeddings.map(row => [...row]) };
      },
    },
    images: {
      generate: async ({ model, prompt, quality, size }: AiImageGenerateInput) => {
        const imageResult = await generateImage({
          model: chatProvider.image(model),
          prompt,
          providerOptions: quality === undefined ? undefined : { openai: { quality } },
          size,
        });

        const bytes = imageResult.image.uint8Array;
        if (bytes.length === 0) {
          throw new Error(`openai_image_invalid`);
        }

        return {
          bytes,
          cost: tunnelCostOptional({ providerMetadata: imageResult.providerMetadata, usage: imageResult.usage }) ?? 0,
        };
      },
    },
    models: { list: () => models },
  };

  return api;
};

export type Ai = Awaited<ReturnType<typeof Ai>>;
