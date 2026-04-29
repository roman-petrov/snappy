/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable no-await-in-loop */
import type { ChatCompletionChunk } from "openai/resources/chat/completions";

import { _ } from "@snappy/core";

import type { AiChatStream, AiChatStreamChunk, AiChatToolCall } from "./Types";

const field = (value: unknown, key: string) =>
  value !== null && _.isObject(value) && key in value ? (value as Record<string, unknown>)[key] : undefined;

const parseArguments = (value: unknown): unknown => {
  if (!_.isString(value)) {
    return undefined;
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
};

const toolCallsFromCompletion = (completion: {
  choices: { message?: { tool_calls?: unknown } }[];
}): readonly AiChatToolCall[] => {
  const raw = completion.choices[0]?.message?.tool_calls;
  if (!_.isArray(raw) || raw.length === 0) {
    return [];
  }
  const out: AiChatToolCall[] = [];
  for (const item of raw) {
    if (!_.isObject(item)) {
      continue;
    }
    const id = field(item, `id`);
    const fn = field(item, `function`);
    if (!_.isString(id) || !_.isObject(fn)) {
      continue;
    }
    const name = field(fn, `name`);
    if (!_.isString(name)) {
      continue;
    }
    out.push({ function: { arguments: parseArguments(field(fn, `arguments`)), name }, id });
  }

  return out;
};

const toolDeltasFromChunk = (chunk: ChatCompletionChunk): boolean => {
  const choices = field(chunk, `choices`);
  if (!_.isArray(choices)) {
    return false;
  }
  for (const choice of choices) {
    const delta = field(choice, `delta`);
    if (!_.isObject(delta)) {
      continue;
    }
    const toolCalls = field(delta, `tool_calls`);
    if (_.isArray(toolCalls) && toolCalls.length > 0) {
      return true;
    }
  }

  return false;
};

type FinalCompletion = { choices: { message?: { tool_calls?: unknown } }[] };

type StreamRunner = {
  done: () => Promise<void>;
  on: ((event: `chunk`, listener: (chunk: ChatCompletionChunk, snapshot: unknown) => void) => unknown) &
    ((event: `content.done`, listener: (props: { content: string }) => void) => unknown) &
    ((event: `content`, listener: (delta: string, snapshot: string) => void) => unknown);
};

export const chatCompletionStream = (
  streamRunner: StreamRunner,
  finalCompletion: () => Promise<FinalCompletion>,
): AiChatStream => {
  let textStopped = false;
  let closed = false;
  let pending: string | undefined;
  const textEndChunk = { type: `textEnd` } as const satisfies AiChatStreamChunk;
  const controllerRef = { current: undefined as ReadableStreamDefaultController<AiChatStreamChunk> | undefined };

  const stream = new ReadableStream<AiChatStreamChunk>({
    start: c => {
      controllerRef.current = c;
    },
  });

  const closeStream = () => {
    if (closed) {
      return;
    }
    closed = true;
    controllerRef.current?.close();
    controllerRef.current = undefined;
  };

  const push = (chunk: string) => {
    if (closed || chunk === `` || textStopped) {
      return;
    }
    controllerRef.current?.enqueue({ text: chunk, type: `text` });
  };

  const flushPendingAsFinal = () => {
    if (pending === undefined) {
      return;
    }
    const last = pending.trimEnd();
    pending = undefined;
    push(last);
  };

  const advancePending = (delta: string) => {
    if (textStopped) {
      return;
    }
    if (pending !== undefined) {
      push(pending);
    }
    pending = delta;
  };

  streamRunner.on(`content`, (delta: string) => {
    if (textStopped || delta === ``) {
      return;
    }
    advancePending(delta);
  });

  streamRunner.on(`content.done`, () => {
    if (!textStopped) {
      flushPendingAsFinal();
    }
  });

  streamRunner.on(`chunk`, (chunk: ChatCompletionChunk) => {
    if (!toolDeltasFromChunk(chunk)) {
      return;
    }
    if (!textStopped) {
      flushPendingAsFinal();
      textStopped = true;
      controllerRef.current?.enqueue(textEndChunk);
    }
  });

  void streamRunner.done().then(async () => {
    if (!textStopped) {
      flushPendingAsFinal();
    }
    const completion = await finalCompletion();
    for (const call of toolCallsFromCompletion(completion)) {
      controllerRef.current?.enqueue({ call, type: `toolCall` });
    }
    closeStream();
  });

  const rs = stream;

  const out: AiChatStream = {
    async *[Symbol.asyncIterator]() {
      const reader = rs.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }
          yield value;
        }
      } finally {
        reader.releaseLock();
      }
    },
  };

  return out;
};
