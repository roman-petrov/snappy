/* eslint-disable no-continue */
/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-try-statements */
/* eslint-disable max-depth */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { _ } from "@snappy/core";
import { z } from "zod";

import type { AiApiTool, AiApiToolCall, AiChatCompletionBody, AiStreamChunk } from "./AiApi";
import type {
  AiChatAssistantMessage,
  AiChatCompletionCreateInput,
  AiChatCompletionSession,
  AiChatStream,
  AiChatStreamSegment,
  AiChatToolChoice,
  AiSessionStop,
  AiToolCall,
  AiToolSet,
} from "./Types";

import { AiConstants } from "./AiConstants";
import { AiCost } from "./AiCost";
import { AiHttp, type AiHttpConfig } from "./AiHttp";
import { AiMessages } from "./AiMessages";
import { AiSse } from "./AiSse";
import { AiTunnel } from "./AiTunnel";
import { AiModel, type AiModelStreamSink } from "./models";

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

const apiTools = (tools: AiToolSet): AiApiTool[] =>
  _.entries(tools).map(([name, definition]) => ({
    function: { description: definition.description, name, parameters: z.toJSONSchema(definition.inputSchema) },
    type: `function`,
  }));

const apiToolChoice = (toolChoice: AiChatToolChoice | undefined) => {
  if (toolChoice === undefined || toolChoice === `auto` || toolChoice === `none`) {
    return toolChoice;
  }

  return { function: { name: toolChoice.name }, type: `function` as const };
};

type ToolCallBuild = { arguments: string; id: string; name: string };

type ToolCallDelta = NonNullable<NonNullable<NonNullable<AiStreamChunk[`choices`]>[0][`delta`]>[`tool_calls`]>[number];

const builtApiToolCalls = (toolCalls: Map<number, ToolCallBuild>): AiApiToolCall[] =>
  [...toolCalls.entries()]
    .toSorted(([a], [b]) => a - b)
    .map(([, row]) => ({
      function: { arguments: row.arguments, name: row.name },
      id: row.id,
      type: `function` as const,
    }))
    .filter(row => row.id !== ``);

const completion = (
  http: AiHttpConfig,
  { model, reasoningEffort, ...input }: AiChatCompletionCreateInput,
): AiChatCompletionSession => {
  const modelPlugin = AiModel.resolve(AiTunnel.chatModelId(model));
  const sourceMessages = `prompt` in input ? [{ content: input.prompt, role: `user` as const }] : input.messages;
  const messages = AiMessages.chatToApi(sourceMessages, modelPlugin);
  const chatInput = `prompt` in input ? undefined : input;
  const reasoning = AiTunnel.reasoningBody(reasoningEffort);

  const body: AiChatCompletionBody = {
    max_tokens: AiConstants.maxChatTokens,
    messages,
    model: AiTunnel.openRouterChatModel(model),
    reasoning,
    stream: true,
    ...modelPlugin.completionExtras(reasoning),
    ...(chatInput?.tools === undefined
      ? {}
      : { tool_choice: apiToolChoice(chatInput.toolChoice), tools: apiTools(chatInput.tools) }),
  };

  const costSlot: { usage?: unknown } = {};
  const segmentOut = streamCell<AiChatStreamSegment>();
  let resolveDone!: (value: { assistant: AiChatAssistantMessage; cost: number }) => void;

  const done = new Promise<{ assistant: AiChatAssistantMessage; cost: number }>(resolve => {
    resolveDone = resolve;
  });

  const enqueue = (segment: AiChatStreamSegment) => {
    segmentOut.push(segment);
  };

  const pump = async () => {
    const textCells: Partial<Record<`chat` | `reasoning`, StreamCell<string>>> = {};
    const toolRows = new Map<number, StreamCell<AiToolCall>>();
    const callsEmitted = new Set<string>();
    let content = ``;
    let reasoningContent = ``;
    const toolCalls = new Map<number, ToolCallBuild>();

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
        enqueue({ stream: textCells[kind].stream, type: kind });
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
      enqueue({ stream: cell.stream, type: `tool` });
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
        enqueue({ stream: cell.stream, type: `tool` });
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
      pushReasoning: pushModelReasoning,
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
          modelPlugin.streamDelta(
            { reasoning: delta.reasoning, reasoningDetails: delta.reasoning_details },
            streamSink,
          );
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

    const builtCalls = builtApiToolCalls(toolCalls);

    const assistant = AiMessages.assistantToAi(
      modelPlugin,
      content,
      reasoningContent,
      builtCalls.length > 0 ? builtCalls : undefined,
    );

    for (const [, row] of toolCalls.entries()) {
      if (row.id === ``) {
        continue;
      }
      emitTool(AiMessages.toolCallFromRow(row));
    }

    resolveDone({ assistant, cost: AiCost.cost(costSlot.usage) });
    segmentOut.close();
  };

  void pump();

  const segments: AiChatStream = segmentOut.stream;

  return {
    assistant: async () => (await done).assistant,
    chatText: stop => textFromSegments(segments, `chat`, stop),
    cost: async () => (await done).cost,
    messages: async () => [(await done).assistant],
    reasoningText: stop => textFromSegments(segments, `reasoning`, stop),
    stream: stop => streamStopped(segments, stop),
  };
};

export const AiChat = { completion };
