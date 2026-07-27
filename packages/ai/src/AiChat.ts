// cspell:word aitunnel
/* eslint-disable no-continue */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable unicorn/prefer-includes-over-repeated-comparisons */
/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-try-statements */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { _ } from "@snappy/core";
import { z } from "zod";

import type { AiChatCompletionBody, AiReasoning, AiStreamChunk } from "./AiApi";
import type { AiModelStreamSink } from "./core-model";
import type { CatalogChat } from "./core-model/ModelChat";
import type {
  AiChatAssistantMessage,
  AiChatCompletionSession,
  AiChatCompletionsInput,
  AiChatStream,
  AiChatStreamSegment,
  AiSessionStop,
  AiToolCall,
} from "./Types";

import { AiConstants } from "./AiConstants";
import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";
import { AiMessages, type ToolCallRow } from "./AiMessages";
import { AiSse } from "./AiSse";
import { AiTunnel } from "./AiTunnel";

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

type ToolCallDelta = NonNullable<NonNullable<NonNullable<AiStreamChunk[`choices`]>[0][`delta`]>[`tool_calls`]>[number];

const reasoningBody = (
  effort: AiChatCompletionsInput[`reasoningEffort`],
  off: CatalogChat[`reasoningOff`],
): AiReasoning | undefined => {
  if (effort !== undefined && effort !== `none`) {
    return { effort };
  }

  return off === `none` ? { effort: `none` } : undefined;
};

const completion = (
  http: AiHttpConfig,
  catalogChat: CatalogChat,
  { reasoningEffort, webSearch, ...input }: AiChatCompletionsInput,
): AiChatCompletionSession => {
  const modelPlugin = catalogChat;
  const sourceMessages = `prompt` in input ? [{ content: input.prompt, role: `user` as const }] : input.messages;
  const apiMessages = AiMessages.chatToApi(sourceMessages, modelPlugin);
  const chatInput = `prompt` in input ? undefined : input;
  const reasoning = reasoningBody(reasoningEffort, modelPlugin.reasoningOff);
  const reasoningEnabled = reasoning !== undefined && reasoning.effort !== `none`;
  const toolChoice = chatInput?.toolChoice;
  const defaults = AiConstants.defaults.webSearch;

  const search =
    webSearch === undefined || webSearch === false
      ? undefined
      : webSearch === true
        ? defaults
        : {
            contextSize: webSearch.contextSize ?? defaults.contextSize,
            maxResults: webSearch.maxResults ?? defaults.maxResults,
            maxUses: webSearch.maxUses ?? defaults.maxUses,
          };

  const tools = [
    ...(search === undefined
      ? []
      : [
          {
            parameters: {
              max_results: search.maxResults,
              max_uses: search.maxUses,
              search_context_size: search.contextSize,
            },
            type: `aitunnel:web_search` as const,
          },
        ]),
    ...(chatInput?.tools === undefined
      ? []
      : _.entries(chatInput.tools).map(([name, definition]) => ({
          function: { description: definition.description, name, parameters: z.toJSONSchema(definition.inputSchema) },
          type: `function` as const,
        }))),
  ];

  const model =
    search === undefined ? AiTunnel.openRouterChatModel(catalogChat.name) : AiTunnel.chatModelId(catalogChat.name);

  const body: AiChatCompletionBody = {
    max_tokens: AiConstants.maxChatTokens,
    messages: apiMessages,
    model,
    stream: true,
    ...(reasoning === undefined ? {} : { reasoning }),
    ...(tools.length === 0
      ? {}
      : {
          tool_choice:
            toolChoice === undefined || toolChoice === `auto` || toolChoice === `none`
              ? toolChoice
              : { function: { name: toolChoice.name }, type: `function` as const },
          tools,
        }),
  };

  const costSlot: { usage?: unknown } = {};
  const segmentOut = streamCell<AiChatStreamSegment>();
  const done = Promise.withResolvers<{ assistant: AiChatAssistantMessage; cost: number }>();

  const pump = async () => {
    const textCells: Partial<Record<`chat` | `reasoning`, StreamCell<string>>> = {};
    const toolRows = new Map<number, StreamCell<AiToolCall>>();
    const callsEmitted = new Set<string>();
    let content = ``;
    let reasoningContent = ``;
    const toolCalls = new Map<number, ToolCallRow>();

    const closeTextStreams = () => {
      for (const kind of [`chat`, `reasoning`] as const) {
        textCells[kind]?.close();
        textCells[kind] = undefined;
      }
    };

    const pushText = (kind: `chat` | `reasoning`, text: string) => {
      if (text === ``) {
        return;
      }
      if (kind === `chat`) {
        content += text;
      }
      const other = kind === `chat` ? `reasoning` : `chat`;
      textCells[other]?.close();
      textCells[other] = undefined;
      if (textCells[kind] === undefined) {
        textCells[kind] = streamCell<string>();
        segmentOut.push({ stream: textCells[kind].stream, type: kind });
      }
      textCells[kind].push(text);
    };

    const emitTool = (call: AiToolCall) => {
      if (callsEmitted.has(call.toolCallId)) {
        return;
      }
      const cell = streamCell<AiToolCall>();
      cell.push(call);
      cell.close();
      segmentOut.push({ stream: cell.stream, type: `tool` });
      callsEmitted.add(call.toolCallId);
    };

    const applyToolDelta = (part: ToolCallDelta) => {
      const { id, index } = part;
      let row = toolCalls.get(index);
      if (row === undefined) {
        row = { arguments: ``, id: id ?? ``, name: part.function?.name ?? `` };
        toolCalls.set(index, row);
      }
      if (_.isString(id) && id !== ``) {
        row.id = id;
      }
      if (_.isString(part.function?.name) && part.function.name !== ``) {
        row.name = part.function.name;
      }
      if (_.isString(part.function?.arguments)) {
        row.arguments += part.function.arguments;
      }
      if (row.id !== `` && toolRows.get(index) === undefined) {
        const cell = streamCell<AiToolCall>();
        toolRows.set(index, cell);
        segmentOut.push({ stream: cell.stream, type: `tool` });
      }
    };

    const pushModelReasoning = (text: string) => {
      reasoningContent += text;
      pushText(`reasoning`, text);
    };

    const streamSink: AiModelStreamSink = {
      pushDetailsReasoning: details => {
        if (!_.isArray(details)) {
          return;
        }
        for (const part of details) {
          if (part.type === `reasoning.text` && _.isString(part.text) && part.text !== ``) {
            pushModelReasoning(part.text);
          }
        }
      },
      pushPlainReasoning: reasoningDelta => {
        if (_.isString(reasoningDelta) && reasoningDelta !== ``) {
          pushModelReasoning(reasoningDelta);

          return true;
        }

        return false;
      },
    };

    try {
      const bodyStream = await AiHttp.postStream(http, `/chat/completions`, body);
      for await (const raw of AiSse.jsonChunks(bodyStream)) {
        const chunk = raw as AiStreamChunk;
        if (chunk.usage !== undefined) {
          costSlot.usage = chunk.usage;
        }
        const choice = chunk.choices?.[0];
        if (choice === undefined) {
          continue;
        }
        const { delta, finish_reason: finishReason } = choice;
        if (delta !== undefined) {
          if (reasoningEnabled) {
            modelPlugin.streamDelta(
              { reasoning: delta.reasoning, reasoningDetails: delta.reasoning_details },
              streamSink,
            );
          }
          const contentDelta = delta.content;
          if (_.isString(contentDelta) && contentDelta !== ``) {
            pushText(`chat`, contentDelta);
          }
          const deltas = delta.tool_calls;
          if (deltas !== undefined) {
            closeTextStreams();
            for (const part of deltas) {
              applyToolDelta(part);
            }
          }
        }
        if (finishReason === `tool_calls` || finishReason === `stop`) {
          closeTextStreams();
        }
      }
    } finally {
      closeTextStreams();
      for (const row of toolRows.values()) {
        row.close();
      }
    }

    const rows = [...toolCalls.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([, row]) => row)
      .filter(row => row.id !== ``);

    const assistant = AiMessages.assistantToAi(
      modelPlugin,
      content,
      reasoningContent,
      rows.length > 0 ? rows : undefined,
    );

    for (const row of rows) {
      emitTool(AiMessages.toolCallToAi(row));
    }

    done.resolve({ assistant, cost: AiCost.cost(costSlot.usage) });
    segmentOut.close();
  };

  void pump();

  const segments: AiChatStream = segmentOut.stream;
  const assistant = async () => (await done.promise).assistant;
  const chatText = (stop?: AiSessionStop) => textFromSegments(segments, `chat`, stop);
  const cost = async () => (await done.promise).cost;
  const messages = async () => [await assistant()];
  const reasoningText = (stop?: AiSessionStop) => textFromSegments(segments, `reasoning`, stop);
  const stream = (stop?: AiSessionStop) => streamStopped(segments, stop);

  return { assistant, chatText, cost, messages, reasoningText, stream };
};

export const AiChat = { completion };
