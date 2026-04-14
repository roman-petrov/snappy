import type { AgentTool } from "@snappy/agent";

import type { FreeOrchestratorToolContext } from "./ToolContext";

export type FreeOrchestratorAgentTool = (context: FreeOrchestratorToolContext) => AgentTool;
