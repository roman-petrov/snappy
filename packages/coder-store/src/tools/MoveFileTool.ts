import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const MoveFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Move a file or folder to another directory in the workspace.`,
    formatCall: ({ directoryPath, path }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Перемещаю: ${path} -> ${directoryPath}`
          : `Переместил: ${path} -> ${directoryPath}`
        : status === `running`
          ? `Moving: ${path} -> ${directoryPath}`
          : `Moved: ${path} -> ${directoryPath}`,
    run: async input => {
      const result = await workspace.moveFile(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `git_move_failed`
            ? `Failed to move via git mv.`
            : `Failed to move path.`
        : `Moved ${input.path} to ${input.directoryPath}.`;
    },
    schema: z.object({
      directoryPath: z.string().min(1).describe(`Target directory path relative to workspace root.`),
      path: z.string().min(1).describe(`Source file or directory path relative to workspace root.`),
    }),
  });
