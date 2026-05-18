/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable unicorn/no-null */
import type { AiApiMessage, AiApiToolCall } from "./AiApi";
import type { AiChatAssistantMessage, AiChatMessage, AiToolCall } from "./Types";

const toolCallToAi = (call: AiApiToolCall): AiToolCall => ({
  argumentsJson: call.function.arguments,
  toolCallId: call.id,
  toolName: call.function.name,
});

const toolCallFromRow = (row: { arguments: string; id: string; name: string }): AiToolCall =>
  toolCallToAi({ function: { arguments: row.arguments, name: row.name }, id: row.id, type: `function` });

const chatToApi = (source: readonly AiChatMessage[]): AiApiMessage[] =>
  source.map((message): AiApiMessage => {
    if (message.role === `system` || message.role === `user`) {
      return { content: message.content, role: message.role };
    }
    if (message.role === `assistant`) {
      const calls = message.toolCalls;
      if (calls !== undefined && calls.length > 0) {
        return {
          content: message.content.trim() === `` ? null : message.content,
          role: `assistant`,
          tool_calls: calls.map(
            (call): AiApiToolCall => ({
              function: { arguments: call.argumentsJson, name: call.toolName },
              id: call.toolCallId,
              type: `function`,
            }),
          ),
        };
      }

      return { content: message.content, role: `assistant` };
    }
    if (message.role === `tool`) {
      return { content: message.content, role: `tool`, tool_call_id: message.toolCallId };
    }

    throw new Error(`ai_unsupported_message`);
  });

const assistantToAi = (content: string, toolCalls?: AiApiToolCall[]): AiChatAssistantMessage => {
  const calls = toolCalls?.map(toolCallToAi) ?? [];
  const trimmed = content.trimEnd();

  return { content: trimmed, role: `assistant`, toolCalls: calls.length > 0 ? calls : undefined };
};

export const AiMessages = { assistantToAi, chatToApi, toolCallFromRow };
