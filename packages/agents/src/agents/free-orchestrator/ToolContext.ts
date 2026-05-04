import type { AgentContext } from "@snappy/agent";
import type { Ai, AiImageSize } from "@snappy/ai";

import type { StaticFormPlan } from "../../core";
import type { AgentAiConfig } from "../../Types";

export type FreeOrchestratorToolContext = {
  agentContext: AgentContext;
  ai: Ai;
  askForm: (plan: StaticFormPlan) => Promise<Record<string, unknown>>;
  config: AgentAiConfig;
  isStopped: () => boolean;
  streamImageArtifact: (input: { prompt: string; size?: AiImageSize }) => Promise<boolean>;
  streamTextArtifact: (prompt: string) => Promise<string>;
};
