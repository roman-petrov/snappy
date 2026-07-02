import { AgentTool } from "@snappy/agent";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const WriteFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Create a text file or overwrite an existing one in the workspace.`,
    execute: async input => {
      const result = await workspace.writeFile(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `write_too_large`
            ? `Refuse: content is too large; write in smaller steps.`
            : `Failed to write file.`
        : `Wrote ${input.path}.`;
    },
    formatCall: ({ path }, status, locale) =>
      Bilingual.status(
        locale,
        status === `running`,
        [`Writing: ${path}`, `Записываю: ${path}`],
        [`Wrote: ${path}`, `Записал: ${path}`],
      ),
    inputSchema: z.object({
      content: z.string().describe(`Full text content to write into the file.`),
      path: z.string().min(1).describe(`File path relative to workspace root.`),
    }),
  });
