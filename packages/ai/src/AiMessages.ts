/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable unicorn/no-null */
import { _ } from "@snappy/core";

import type { AiApiAssistantMessage, AiApiContentPart, AiApiMessage, AiApiToolCall } from "./AiApi";
import type { AiModelBehavior } from "./core-model";
import type { AiChatAssistantMessage, AiChatMessage, AiChatUserContent, AiContentPart, AiToolCall } from "./Types";

export type ToolCallRow = { arguments: string; id: string; name: string };

const hasToolCalls = (calls: AiToolCall[] | undefined): calls is AiToolCall[] => _.isArray(calls) && calls.length > 0;

const toolCallToAi = (row: ToolCallRow): AiToolCall => ({
  argumentsJson: row.arguments,
  toolCallId: row.id,
  toolName: row.name,
});

const toolCallToApi = (row: ToolCallRow): AiApiToolCall => ({
  function: { arguments: row.arguments, name: row.name },
  id: row.id,
  type: `function`,
});

const apiToolCalls = (calls: AiToolCall[]): AiApiToolCall[] =>
  calls.map(call => toolCallToApi({ arguments: call.argumentsJson, id: call.toolCallId, name: call.toolName }));

const assistantToApi = (
  message: Extract<AiChatMessage, { role: `assistant` }>,
  modelPlugin: AiModelBehavior,
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
  modelPlugin: AiModelBehavior,
  content: string,
  reasoning: string,
  toolCallRows?: ToolCallRow[],
): AiChatAssistantMessage => {
  const calls = toolCallRows?.map(toolCallToAi);

  return {
    content: content.trimEnd(),
    role: `assistant`,
    toolCalls: hasToolCalls(calls) ? calls : undefined,
    ...modelPlugin.assistantReasoningExtras(reasoning),
  };
};

const partToApi = (part: AiContentPart): AiApiContentPart =>
  part.type === `text` ? { text: part.text, type: `text` } : { image_url: { url: part.url }, type: `image_url` };

const userContentToApi = (content: AiChatUserContent): AiApiContentPart[] | string =>
  _.isString(content) ? content : content.map(partToApi);

const chatToApi = (source: readonly AiChatMessage[], modelPlugin: AiModelBehavior): AiApiMessage[] =>
  source.map((message): AiApiMessage => {
    if (message.role === `system`) {
      return { content: message.content, role: `system` };
    }
    if (message.role === `user`) {
      return { content: userContentToApi(message.content), role: `user` };
    }
    if (message.role === `assistant`) {
      return assistantToApi(message, modelPlugin);
    }
    if (message.role === `tool`) {
      return { content: message.content, role: `tool`, tool_call_id: message.toolCallId };
    }

    throw new Error(`ai_unsupported_message`);
  });

export const AiMessages = { assistantToAi, chatToApi, toolCallToAi };
