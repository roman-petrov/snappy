/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable unicorn/no-null */
import { _ } from "@snappy/core";

import type { AiApiAssistantMessage, AiApiMessage, AiApiToolCall } from "./AiApi";
import type { AiModel } from "./models/AiModel";
import type { AiChatAssistantMessage, AiChatMessage, AiToolCall } from "./Types";

const hasToolCalls = (calls: AiToolCall[] | undefined): calls is AiToolCall[] => _.isArray(calls) && calls.length > 0;

const toolCallToAi = (call: AiApiToolCall): AiToolCall => ({
  argumentsJson: call.function.arguments,
  toolCallId: call.id,
  toolName: call.function.name,
});

const toolCallFromRow = (row: { arguments: string; id: string; name: string }): AiToolCall =>
  toolCallToAi({ function: { arguments: row.arguments, name: row.name }, id: row.id, type: `function` });

const apiToolCalls = (calls: AiToolCall[]): AiApiToolCall[] =>
  calls.map(
    (call): AiApiToolCall => ({
      function: { arguments: call.argumentsJson, name: call.toolName },
      id: call.toolCallId,
      type: `function`,
    }),
  );

const assistantToApi = (
  message: Extract<AiChatMessage, { role: `assistant` }>,
  modelPlugin: AiModel,
): AiApiAssistantMessage => {
  const calls = message.toolCalls;
  if (!hasToolCalls(calls)) {
    return { content: message.content, role: `assistant` };
  }

  return {
    content: message.content.trim() === `` ? null : message.content,
    role: `assistant`,
    tool_calls: apiToolCalls(calls),
    ...modelPlugin.assistantToolCallsExtras(message),
  };
};

const assistantToAi = (
  modelPlugin: AiModel,
  content: string,
  reasoning: string,
  toolCalls?: AiApiToolCall[],
): AiChatAssistantMessage => {
  const calls = toolCalls?.map(toolCallToAi);

  return {
    content: content.trimEnd(),
    role: `assistant`,
    toolCalls: hasToolCalls(calls) ? calls : undefined,
    ...modelPlugin.assistantReasoningExtras(reasoning),
  };
};

const chatToApi = (source: readonly AiChatMessage[], modelPlugin: AiModel): AiApiMessage[] =>
  source.map((message): AiApiMessage => {
    if (message.role === `system` || message.role === `user`) {
      return { content: message.content, role: message.role };
    }
    if (message.role === `assistant`) {
      return assistantToApi(message, modelPlugin);
    }
    if (message.role === `tool`) {
      return { content: message.content, role: `tool`, tool_call_id: message.toolCallId };
    }

    throw new Error(`ai_unsupported_message`);
  });

export const AiMessages = { assistantToAi, chatToApi, toolCallFromRow };
