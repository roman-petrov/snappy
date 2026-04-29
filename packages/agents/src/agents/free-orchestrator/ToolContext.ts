import type { AgentContext } from "@snappy/agent";
import type { Ai } from "@snappy/ai";

import type { StaticFormPlan } from "../../core";
import type { AgentAiConfig } from "../../Types";
import type { StorageApi } from "./Storage";

export type FreeOrchestratorToolContext = {
  agentContext: AgentContext;
  ai: Ai;
  askForm: (plan: StaticFormPlan) => Promise<Record<string, unknown>>;
  config: AgentAiConfig;
  isStopped: () => boolean;
  publishImage: (input: { generationPrompt: string; src: string }) => void;
  publishText: (input: { generationPrompt: string; html: string }) => void;
  storage: StorageApi;
};
