import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export type McpTool = (server: McpServer, deps: { root: string }) => void;
