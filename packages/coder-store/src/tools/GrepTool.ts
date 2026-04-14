import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import { ToolSchema, type WorkspaceAgentTool } from "../core";

export const GrepTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Find text matches in workspace files limited by an optional glob scope.`,
    formatCall: ({ glob, pattern }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Ищу "${pattern}" в ${glob}`
          : `Нашел "${pattern}" в ${glob}`
        : status === `running`
          ? `Searching "${pattern}" in ${glob}`
          : `Searched "${pattern}" in ${glob}`,
    run: async input => {
      const result = await workspace.grep(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `grep_invalid_pattern`
            ? `Invalid regex pattern.`
            : result.error === `grep_invalid_glob`
              ? `Invalid glob scope.`
              : `Unable to scan files right now.`
        : result.result.files.length === 0
          ? `No matches for pattern in ${result.result.scopeGlob}.`
          : result.result.files.join(`\n`);
    },
    schema: z.object({
      caseInsensitive: z.boolean().optional().describe(`Enable case-insensitive search when true.`),
      glob: ToolSchema.glob(workspace.limits.globPatternMaxChars),
      maxHits: z
        .number()
        .int()
        .min(1)
        .max(workspace.limits.grepMaxHitsLimit)
        .optional()
        .describe(`Maximum number of matched files to return.`),
      pattern: z.string().min(1).max(workspace.limits.grepPatternMaxChars).describe(`Regex pattern to search for.`),
    }),
  });
