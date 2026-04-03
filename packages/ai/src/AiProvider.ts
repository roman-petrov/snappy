/* eslint-disable @typescript-eslint/naming-convention  */

export type ChatCompletionResponse = { choices: ChatChoice[] };

export type ChatMessage = {
  content: string | undefined;
  role: `assistant` | `system` | `tool` | `user`;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
};

export type ChatRequest = { messages: ChatMessage[]; model: string; tools?: unknown[] };

export type ToolCall = { function: { arguments: string; name: string }; id: string; type: `function` };

type ChatChoice = { finish_reason: null | string; message: ChatMessage };

/** Thrown by bridge LLM when no desktop client is connected for this relay key. */
export const LlmErrors = { bridgeOffline: `bridge_offline` } as const;

/** LLM access only through an injected implementation (e.g. desktop client bridge). No direct Ollama in this package. */
export type AiLlm = {
  chatCompletion: (body: ChatRequest) => Promise<ChatCompletionResponse>;
  generatePng: (prompt: string, model: string) => Promise<Uint8Array>;
};

export const AiProvider = { fromLlm: (llm: AiLlm): AiLlm => llm };
