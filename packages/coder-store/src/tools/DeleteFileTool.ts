import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const DeleteFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Delete a file or folder from the workspace.`,
    formatCall: ({ path }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Удаляю: ${path}`
          : `Удалил: ${path}`
        : status === `running`
          ? `Deleting: ${path}`
          : `Deleted: ${path}`,
    run: async input => {
      const result = await workspace.deleteFile(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : `Failed to delete path.`
        : `Deleted ${input.path}.`;
    },
    schema: z.object({ path: z.string().min(1).describe(`File or directory path relative to workspace root.`) }),
  });
