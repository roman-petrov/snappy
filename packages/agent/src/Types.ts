import type { Ai, AiChatMessage } from "@snappy/ai";
import type { StructuredPrompt } from "@snappy/core";

import type { AgentToolGroup } from "./AgentTool";

export type AgentContext = { isStopped: () => boolean };

export type AgentCreateInput = {
  ai: Ai;
  chatModel: string;
  locale: AgentLocale;
  maxRounds: number;
  systemPrompt: StructuredPrompt;
  tools: Record<string, AgentToolGroup>;
};

export type AgentLocale = `en` | `ru`;

export type AgentRun = AsyncIterable<AgentStreamPart> & {
  done: Promise<{ error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }>;
  stop: () => void;
};

export type AgentStopReason = `failed` | `stopped` | `success`;

export type AgentStreamPart =
  | { callId: string; finished: Promise<{ label: string }>; label: string; type: `tool` }
  | { chunks: AsyncIterable<string>; type: `text` }
  | { error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason; type: `run` }
  | { finished: Promise<{ label: string }>; label: string; type: `thinking` };
