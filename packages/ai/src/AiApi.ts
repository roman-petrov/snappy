/* eslint-disable @typescript-eslint/naming-convention */
export type AiApiAssistantMessage = {
  content: null | string;
  reasoning_content?: string;
  role: `assistant`;
  tool_calls?: AiApiToolCall[];
};

export type AiApiContentPart = { image_url: { url: string }; type: `image_url` } | { text: string; type: `text` };

export type AiApiMessage =
  | AiApiAssistantMessage
  | { content: AiApiContentPart[] | string; role: `user` }
  | { content: string; role: `system` }
  | { content: string; role: `tool`; tool_call_id: string };

export type AiApiTool = {
  function: { description: string; name: string; parameters: Record<string, unknown> };
  type: `function`;
};

export type AiApiToolCall = { function: { arguments: string; name: string }; id: string; type: `function` };

export type AiApiToolChoice = `auto` | `none` | { function: { name: string }; type: `function` };

export type AiChatCompletionBody = {
  max_tokens?: number;
  messages: AiApiMessage[];
  model: string;
  reasoning?: AiReasoning;
  stream: boolean;
  thinking?: { type: `disabled` | `enabled` };
  tool_choice?: AiApiToolChoice;
  tools?: AiApiTool[];
};

export type AiReasoning = { effort: `high` | `low` | `medium` | `minimal` | `none` | `xhigh`; exclude?: boolean };

export type AiStreamChunk = {
  choices?: { delta?: AiStreamDelta; finish_reason?: null | string }[];
  usage?: { cost_rub?: number };
};

export type AiStreamDelta = {
  content?: null | string;
  reasoning?: null | string;
  reasoning_details?: { format?: string; index?: number; text?: string; type?: string }[];
  role?: string;
  tool_calls?: { function?: { arguments?: string; name?: string }; id?: string; index: number; type?: string }[];
};
