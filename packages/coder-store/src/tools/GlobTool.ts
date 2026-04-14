import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import { ToolSchema, type WorkspaceAgentTool } from "../core";

export const GlobTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Find files and directories in workspace by glob pattern.`,
    formatCall: ({ pattern }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Ищу по glob: ${pattern}`
          : `Нашел по glob: ${pattern}`
        : status === `running`
          ? `Globbing: ${pattern}`
          : `Globbed: ${pattern}`,
    run: async input => {
      const result = await workspace.glob(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `glob_pattern_empty`
            ? `Pattern must be non-empty.`
            : `Unable to match paths right now.`
        : result.result.length === 0
          ? `No paths matched.`
          : result.result;
    },
    schema: z.object({ pattern: ToolSchema.glob(workspace.limits.globPatternMaxChars) }),
  });
