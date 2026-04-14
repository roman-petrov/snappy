import type { AiChatMessage, AiChatTool } from "@snappy/ai";
import type { StructuredPrompt } from "@snappy/core";

import type { AgentToolCallStatus, AgentToolGroup } from "./AgentTool";

export type AgentAdapter = {
  chat: (messages: AiChatMessage[], tools: AiChatTool[]) => Promise<AiChatMessage | undefined>;
  maxRounds: number;
  observeSessionMessages?: (messages: AiChatMessage[]) => Promise<void> | void;
  onAssistantMessage?: (message: AiChatMessage) => Promise<void> | void;
  onStop: (reason: AgentStopReason, error?: unknown) => Promise<void> | void;
  onToolCallEvent?: (event: AgentToolCallEvent) => Promise<void> | void;
  tools: Record<string, AgentToolGroup>;
};

export type AgentContext = { isStopped: () => boolean };

export type AgentLocale = string;

export type AgentStartInput = { initialMessages: AiChatMessage[]; systemPrompt: StructuredPrompt };

export type AgentStopReason = `failed` | `stopped` | `success`;

export type AgentToolCallEvent = { callId: string; label: string; status: AgentToolCallStatus; toolName: string };
