/* eslint-disable functional/no-expression-statements */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Console } from "@snappy/node";

import { McpTools } from "./mcp";

const server = new McpServer({ name: `do`, version: `0.0.0` }, { capabilities: { tools: {} } });

McpTools.register(server);

await server.connect(new StdioServerTransport());
Console.errorLine(`Do MCP server running on stdio`);
