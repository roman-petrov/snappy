/* eslint-disable @typescript-eslint/naming-convention */
export type AiApiMessage =
  | { content: null | string; role: `assistant`; tool_calls?: AiApiToolCall[] }
  | { content: string; role: `system` | `user` }
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
  choices?: {
    delta?: {
      content?: null | string;
      reasoning?: null | string;
      tool_calls?: { function?: { arguments?: string; name?: string }; id?: string; index: number }[];
    };
    finish_reason?: null | string;
  }[];
  usage?: { cost_rub?: number };
};
