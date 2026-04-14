import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const ListDirectoryTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `List files and folders in a workspace directory.`,
    formatCall: ({ path }, status, locale) => {
      const value = path ?? `.`;

      return locale === `ru`
        ? status === `running`
          ? `Читаю список: ${value}`
          : `Прочитал список: ${value}`
        : status === `running`
          ? `Listing: ${value}`
          : `Listed: ${value}`;
    },
    run: async input => {
      const result = await workspace.listDirectory(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : `Failed to list directory.`
        : result.result;
    },
    schema: z.object({
      path: z
        .string()
        .optional()
        .describe(`Directory path relative to workspace root. Uses current directory when omitted.`),
    }),
  });
