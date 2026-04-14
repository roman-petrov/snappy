import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { WorkspaceAgentTool } from "../core";

export const WriteFileTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Create a text file or overwrite an existing one in the workspace.`,
    formatCall: ({ path }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Записываю: ${path}`
          : `Записал: ${path}`
        : status === `running`
          ? `Writing: ${path}`
          : `Wrote: ${path}`,
    run: async input => {
      const result = await workspace.writeFile(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `write_too_large`
            ? `Refuse: content is too large; write in smaller steps.`
            : `Failed to write file.`
        : `Wrote ${input.path}.`;
    },
    schema: z.object({
      content: z.string().describe(`Full text content to write into the file.`),
      path: z.string().min(1).describe(`File path relative to workspace root.`),
    }),
  });
