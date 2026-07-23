import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { Runner } from "../Runner";
import { McpToolColor, McpToolConventions, McpToolWorkflowRun } from "./tools";

const register = (server: McpServer) => {
  const fromEnv = process.env[`MCP_SERVER_ROOT`];
  const root = fromEnv !== undefined && fromEnv !== `` ? fromEnv : Runner.repoRoot;

  return [McpToolWorkflowRun, McpToolColor, McpToolConventions].map(tool => tool(server, { root }));
};

export const McpTools = { register };
