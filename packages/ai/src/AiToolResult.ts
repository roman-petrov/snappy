import { _ } from "@snappy/core";

import type { AiChatMessage, AiContentPart, AiModality, AiToolRunResult } from "./Types";

const messages = (
  result: AiToolRunResult,
  { chatInput, toolCallId }: { chatInput: readonly AiModality[]; toolCallId: string },
): AiChatMessage[] => {
  const toolMessage: AiChatMessage = {
    content: _.isString(result) ? result : `error` in result ? `Tool failed: ${result.error}` : result.tool,
    role: `tool`,
    toolCallId,
  };

  if (_.isString(result) || `error` in result) {
    return [toolMessage];
  }

  const parts = (result.context ?? []).flatMap((part): AiContentPart[] =>
    part.type === `text` || chatInput.includes(part.type) ? [part] : [],
  );

  const content =
    parts.length === 0 ? undefined : parts.length === 1 && parts[0]?.type === `text` ? parts[0].text : parts;

  return content === undefined ? [toolMessage] : [toolMessage, { content, role: `user` }];
};

export const AiToolResult = { messages };
