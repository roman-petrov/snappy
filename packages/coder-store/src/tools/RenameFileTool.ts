import { AgentTool } from "@snappy/agent";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const RenameFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Rename a file or folder in the workspace.`,
    execute: async input => {
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
    formatCall: ({ newName, path }, status, locale) =>
      Bilingual.status(
        locale,
        status === `running`,
        [`Renaming: ${path} -> ${newName}`, `Переименовываю: ${path} -> ${newName}`],
        [`Renamed: ${path} -> ${newName}`, `Переименовал: ${path} -> ${newName}`],
      ),
    inputSchema: z.object({
      newName: z.string().min(1).describe(`New name only, without a directory path.`),
      path: z.string().min(1).describe(`Source file or directory path relative to workspace root.`),
    }),
  });
