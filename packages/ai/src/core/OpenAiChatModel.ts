/* eslint-disable no-continue */
/* eslint-disable func-names */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
import type { OpenAI } from "openai";
import type { ChatCompletionChunk } from "openai/resources/chat/completions";

import { _, StructuredPrompt } from "@snappy/core";

import type { AiChatStreamDone, AiGenericChatModel, AiLocale } from "../Types";

export type OpenAiChatModelConfig = {
  cost: (usage: OpenAiChatUsage | undefined) => number;
  locale: AiLocale;
  name: string;
};

export type OpenAiChatUsage = ChatCompletionChunk[`usage`];

export const OpenAiChatModel =
  ({ cost, locale, name }: OpenAiChatModelConfig) =>
  (client: OpenAI): AiGenericChatModel => {
    const process: AiGenericChatModel[`process`] = async input => {
      const sourceMessages = _.isString(input) ? [{ content: input, role: `user` as const }] : input.messages;
      const languageName = locale === `ru` ? `Russian` : `English`;

      const messages = [
        {
          content: StructuredPrompt.create({
            language_policy: [
              `Mandatory language for this session: ${languageName} (locale: ${locale}).`,
              `Use only this language in all assistant messages.`,
              `Use only this language in tool calls, including function arguments and any tool-facing text.`,
              `Do not mix languages unless the user explicitly asks for multilingual output.`,
            ].join(`\n`),
          }),
          role: `system` as const,
        },
        ...sourceMessages,
      ].map(message => {
        if (message.role === `assistant`) {
          const { toolCalls, ...rest } = message;

          return { ...rest, tool_calls: toolCalls?.map(call => ({ ...call, type: `function` as const })) };
        }

        return message.role === `tool`
          ? { content: message.content, role: `tool` as const, tool_call_id: message.toolCallId }
          : { content: message.content, role: message.role };
      });

      const stream = await client.chat.completions.create({
        ...(_.isString(input)
          ? {}
          : {
              tool_choice:
                input.toolChoice === undefined || input.toolChoice === `auto` || input.toolChoice === `none`
                  ? input.toolChoice
                  : { function: { name: input.toolChoice.name }, type: `function` as const },
              tools: input.tools?.map(tool => ({ ...tool, type: `function` as const })),
            }),
        messages,
        model: name,
        stream: true,
        stream_options: { include_usage: true },
      });

      let resolveDone = undefined as ((value: AiChatStreamDone) => void) | undefined;
      let rejectDone = undefined as ((error: unknown) => void) | undefined;

      const done = new Promise<AiChatStreamDone>((resolve, reject) => {
        resolveDone = resolve;
        rejectDone = reject;
      });

      const streamText = async function* (): AsyncIterable<string> {
        const toolCallsByIndex = new Map<number, { arguments: string; id: string; name: string }>();
        let text = ``;
        let trailingWhitespace = ``;
        let usage = undefined as OpenAiChatUsage | undefined;
        try {
          for await (const chunk of stream) {
            usage = chunk.usage ?? usage;
            const [choice] = chunk.choices;
            if (choice === undefined) {
              continue;
            }
            const deltaText = choice.delta.content ?? ``;
            text += deltaText;
            for (const call of choice.delta.tool_calls ?? []) {
              const key = call.index;

              const saved = toolCallsByIndex.get(key) ?? {
                arguments: ``,
                id: call.id ?? crypto.randomUUID(),
                name: ``,
              };

              toolCallsByIndex.set(key, {
                arguments: saved.arguments + (call.function?.arguments ?? ``),
                id: call.id ?? saved.id,
                name: call.function?.name ?? saved.name,
              });
            }
            if (deltaText === ``) {
              continue;
            }

            const streamChunk = trailingWhitespace + deltaText;
            const trimmedChunk = streamChunk.trimEnd();
            if (trimmedChunk === ``) {
              trailingWhitespace = streamChunk;
              continue;
            }
            trailingWhitespace = streamChunk.slice(trimmedChunk.length);
            yield trimmedChunk;
          }
          const normalizedText = text.trimEnd();

          const toolCalls = [...toolCallsByIndex.values()].map(call => ({
            function: { arguments: call.arguments, name: call.name },
            id: call.id,
          }));
          resolveDone?.({
            cost: cost(usage),
            message: {
              content: normalizedText,
              role: `assistant`,
              toolCalls: toolCalls.length === 0 ? undefined : toolCalls,
            },
            text: normalizedText,
          });
        } catch (error) {
          rejectDone?.(error);
          throw error;
        }
      };

      return { done, stream: streamText() };
    };

    return { name, process, type: `chat` };
  };
