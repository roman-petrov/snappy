import { AgentTool } from "@snappy/agent";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const DeleteFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Delete a file or folder from the workspace.`,
    execute: async input => {
      const result = await workspace.deleteFile(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : `Failed to delete path.`
        : `Deleted ${input.path}.`;
    },
    formatCall: ({ path }, status, locale) =>
      Bilingual.status(
        locale,
        status === `running`,
        [`Deleting: ${path}`, `Удаляю: ${path}`],
        [`Deleted: ${path}`, `Удалил: ${path}`],
      ),
    inputSchema: z.object({ path: z.string().min(1).describe(`File or directory path relative to workspace root.`) }),
  });
