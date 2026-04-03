import type { AiLlm } from "@snappy/ai";
import type { UiPlan } from "@snappy/domain";
import type { PresetLocale } from "@snappy/presets";
import type { ZodObject } from "zod";

export type AgentChatLoopInput = {
  /** Labels preset form values in the user message (preset mode). Defaults to \`ru\` if omitted. */
  answersLocale?: PresetLocale;
  /** Ollama chat model name (from user settings or catalog). */
  chatModel: string;
  clientToolResults?: { content: string; toolCallId: string }[];
  /** Image generation model name. */
  imageModel: string;
  llm: AiLlm;
  message?: string;
  persistPng: (png: Uint8Array) => Promise<string>;
  presetId: string;
  session: AgentSessionPort;
  uiAnswers?: Record<string, unknown>;
  uiToolCallId?: string;
};

export type AgentMessage = { content: unknown; hiddenFromFeed?: boolean; id: string; role: string };

export type AgentRunOk = {
  messages: AgentMessage[];
  pendingClientTool?: { args: Record<string, unknown>; toolCallId: string };
  pendingUi?: { plan: UiPlan; toolCallId: string };
  status: `ok`;
};

export type AgentRunResult = AgentRunOk | { status: `processingFailed` } | { status: `relayOffline` };

export type AgentSessionPort = {
  appendMessage: (role: string, content: unknown, options?: { hiddenFromFeed?: boolean }) => Promise<unknown>;
  messages: () => Promise<AgentMessage[]>;
  touch: () => Promise<unknown>;
};

export type AgentTool = {
  apiDescription: string;
  argsSchema: ZodObject;
  name: string;
  run: ToolRun;
  systemPrompt: string;
};

export type AgentToolDefinition = {
  apiDescription: string;
  argsSchema: ZodObject;
  definition: {
    function: { description: string; name: string; parameters: Record<string, unknown> };
    type: `function`;
  };
  name: string;
  systemPrompt: string;
};

export type ToolRun = (context: ToolRunContext, input: { args: unknown; toolCallId: string }) => Promise<ToolRunResult>;

export type ToolRunContext = {
  generatePng: (prompt: string) => Promise<Uint8Array>;
  persistPng: (png: Uint8Array) => Promise<string>;
};

export type ToolRunResult =
  | { args: Record<string, unknown>; kind: `pending_client_tool`; toolCallId: string }
  | { content: string; kind: `tool_message` }
  | { kind: `pending_ui`; plan: UiPlan; toolCallId: string };
