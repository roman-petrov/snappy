import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { McpToolColor, McpToolWorkflowRun } from "./tools";

const register = (server: McpServer) => [McpToolWorkflowRun, McpToolColor].map(tool => tool(server));

export const McpTools = { register };
