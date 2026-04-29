import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const ReadFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Read text file content from the workspace.`,
    execute: async input => {
      const result = await workspace.readFile(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `read_binary`
            ? `File appears binary; skipped.`
            : `Failed to read file.`
        : result.result;
    },
    formatCall: ({ path }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Читаю: ${path}`
          : `Прочитал: ${path}`
        : status === `running`
          ? `Reading: ${path}`
          : `Read: ${path}`,
    inputSchema: z.object({
      maxChars: z
        .number()
        .int()
        .min(workspace.limits.minReadChars)
        .max(workspace.limits.maxReadChars)
        .optional()
        .describe(`Maximum number of characters to return from the file.`),
      path: z.string().min(1).describe(`File path relative to workspace root.`),
    }),
  });
