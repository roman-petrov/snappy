import type { AiChatMessage, AiChatModel } from "@snappy/ai";
import type { StructuredPrompt } from "@snappy/core";
import type { Locale } from "@snappy/intl";

import type { AgentToolGroup } from "./AgentTool";

export type AgentClient = {
  chatStream: (stream: AsyncIterable<string>) => Promise<void>;
  reasoningStream: (stream: AsyncIterable<string>) => Promise<void>;
  thinking: (label: string, done: PromiseWithResolvers<{ label: string }>) => void;
  tool: (part: { callId: string; done: PromiseWithResolvers<{ label: string }>; label: string }) => void;
};

export type AgentCreateInput = {
  chatModel: AiChatModel;
  idleAfterSuccess?: boolean;
  locale: Locale;
  maxRounds: number;
  systemPrompt: StructuredPrompt;
  tools: (context: AgentToolsContext) => Record<string, AgentToolGroup>;
};

export type AgentRun = {
  appendUserText: (text: string) => void;
  done: Promise<{ error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }>;
  stop: () => void;
};

export type AgentStopReason = `failed` | `stopped` | `success`;

export type AgentToolsContext = { isStopped: () => boolean };
