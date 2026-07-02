import { AgentTool } from "@snappy/agent";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import { ToolSchema, type WorkspaceAgentTool } from "../core";

export const GlobTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Find files and directories in workspace by glob pattern.`,
    execute: async input => {
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
    formatCall: ({ pattern }, status, locale) =>
      Bilingual.status(
        locale,
        status === `running`,
        [`Globbing: ${pattern}`, `Ищу по glob: ${pattern}`],
        [`Globbed: ${pattern}`, `Нашел по glob: ${pattern}`],
      ),
    inputSchema: z.object({ pattern: ToolSchema.glob(workspace.limits.globPatternMaxChars) }),
  });
