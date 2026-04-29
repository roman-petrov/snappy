import type { Ai, AiChatMessage } from "@snappy/ai";
import type { StructuredPrompt } from "@snappy/core";
import type { Locale } from "@snappy/intl";

import type { AgentToolGroup } from "./AgentTool";

export type AgentCreateInput = {
  ai: Ai;
  chatModel: string;
  idleAfterSuccess?: boolean;
  locale: Locale;
  maxRounds: number;
  systemPrompt: StructuredPrompt;
  tools: Record<string, AgentToolGroup>;
};

export type AgentRun = AsyncIterable<AgentStreamPart> & {
  appendUserText: (text: string) => void;
  done: Promise<{ error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason }>;
  stop: () => void;
};

export type AgentStopReason = `failed` | `stopped` | `success`;

export type AgentStreamPart =
  | { callId: string; finished: Promise<{ label: string }>; label: string; type: `tool` }
  | { error?: unknown; messages: AiChatMessage[]; reason: AgentStopReason; type: `run` }
  | { finished: Promise<{ label: string }>; label: string; type: `thinking` }
  | { stream: AsyncIterable<string>; type: `model_stream`; variant: `chat` | `reasoning` };
