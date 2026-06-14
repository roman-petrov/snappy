import { _ } from "@snappy/core";

import type { AiChatMessage, AiContentPart, AiModality, AiToolRunResult } from "./Types";

const toolContent = (result: AiToolRunResult): string => {
  if (_.isString(result)) {
    return result;
  }
  if (`error` in result) {
    return `Tool failed: ${result.error}`;
  }

  return result.tool;
};

const partModality = (part: AiContentPart): AiModality | undefined => {
  if (part.type === `image`) {
    return `image`;
  }
  if (part.type === `text`) {
    return `text`;
  }

  return undefined;
};

const filteredContext = (context: readonly AiContentPart[], chatInput: readonly AiModality[]) =>
  context.filter(part => {
    const modality = partModality(part);

    return modality !== undefined && chatInput.includes(modality);
  });

const messages = (
  result: AiToolRunResult,
  { chatInput, toolCallId }: { chatInput: readonly AiModality[]; toolCallId: string },
): AiChatMessage[] => {
  const toolMessage: AiChatMessage = { content: toolContent(result), role: `tool`, toolCallId };

  if (_.isString(result) || `error` in result) {
    return [toolMessage];
  }

  const context = result.context === undefined ? [] : filteredContext(result.context, chatInput);

  return context.length === 0 ? [toolMessage] : [toolMessage, { content: context, role: `user` }];
};

export const AiToolResult = { messages };
