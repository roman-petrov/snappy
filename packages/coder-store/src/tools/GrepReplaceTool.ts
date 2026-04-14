import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import { ToolSchema, type WorkspaceAgentTool } from "../core";

export const GrepReplaceTool: WorkspaceAgentTool = workspace =>
  AgentTool({
    description: `Replace exact text in all files matched by glob scope. Pass a concrete file path as glob to target one file.`,
    formatCall: ({ glob, oldString }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Заменяю "${oldString}" в ${glob}`
          : `Заменил "${oldString}" в ${glob}`
        : status === `running`
          ? `Replacing "${oldString}" in ${glob}`
          : `Replaced "${oldString}" in ${glob}`,
    run: async input => {
      const result = await workspace.grepReplace(input);

      return `error` in result
        ? result.error === `path_traversal`
          ? `Path is outside workspace root.`
          : result.error === `old_string_empty`
            ? `oldString must be a non-empty string.`
            : result.error === `old_string_not_found`
              ? `oldString not found in matched files.`
              : `Failed to update files.`
        : result.result.files.join(`\n`);
    },
    schema: z.object({
      glob: ToolSchema.glob(workspace.limits.globPatternMaxChars),
      newString: z.string().describe(`Replacement text. Can be empty.`),
      oldString: z.string().min(1).describe(`Exact text to find. Must be non-empty.`),
    }),
  });
