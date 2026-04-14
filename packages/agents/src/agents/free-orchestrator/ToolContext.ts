import type { AgentContext } from "@snappy/agent";

import type { AgentStartInput } from "../../Types";
import type { StorageApi } from "./Storage";

export type FreeOrchestratorToolContext = { agentContext: AgentContext; input: AgentStartInput; storage: StorageApi };
