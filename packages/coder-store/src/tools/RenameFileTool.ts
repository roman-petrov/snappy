import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const RenameFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Rename a file or folder in the workspace.`,
    formatCall: ({ newName, path }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Переименовываю: ${path} -> ${newName}`
          : `Переименовал: ${path} -> ${newName}`
        : status === `running`
          ? `Renaming: ${path} -> ${newName}`
          : `Renamed: ${path} -> ${newName}`,
    run: async input => {
      const result = await workspace.renameFile(input);

      return `error` in result
        ? result.error === `invalid_name`
          ? `Invalid new name. Use a single file/folder name without path separators.`
          : result.error === `path_traversal`
            ? `Path is outside workspace root.`
            : result.error === `git_move_failed`
              ? `Failed to rename via git mv.`
              : `Failed to rename path.`
        : `Renamed ${input.path} to ${input.newName}.`;
    },
    schema: z.object({
      newName: z.string().min(1).describe(`New name only, without a directory path.`),
      path: z.string().min(1).describe(`Source file or directory path relative to workspace root.`),
    }),
  });
