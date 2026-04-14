import type { AgentTool } from "@snappy/agent";

import type { Workspace } from "./Workspace";

export type WorkspaceAgentTool = (workspace: Workspace) => AgentTool;
