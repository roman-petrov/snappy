import { AgentTool } from "@snappy/agent";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const ListDirectoryTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `List files and folders in a workspace directory.`,
    execute: async input => {
      const result = await workspace.listDirectory(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : `Failed to list directory.`
        : result.result;
    },
    formatCall: ({ path }, status, locale) => {
      const value = path ?? `.`;

      return Bilingual.status(
        locale,
        status === `running`,
        [`Listing: ${value}`, `Читаю список: ${value}`],
        [`Listed: ${value}`, `Прочитал список: ${value}`],
      );
    },
    inputSchema: z.object({
      path: z
        .string()
        .optional()
        .describe(`Directory path relative to workspace root. Uses current directory when omitted.`),
    }),
  });
