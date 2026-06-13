import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const PublishTextTool: SnappyToolFactory = ({ ai, config, feed, isStopped }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user expects a published long-form text result (draft/rewrite), not a short direct chat reply.`,
      ],
      [
        `input`,
        `Pass a self-contained prompt with goal, audience, tone, format, constraints, and source excerpts when rewriting. Clarify first if critical facts are missing.`,
      ],
      [`output`, `After publish the full generated text is returned in the tool result for review and iteration.`],
    ],
    execute: async ({ prompt }) => {
      if (isStopped()) {
        return ``;
      }
      const { content } = await feed.generateText({ ai, model: config.models.chat, prompt });

      return isStopped() ? `` : content;
    },
    inputSchema: z.object({
      prompt: z
        .string()
        .min(1)
        .describe(`Self-contained text prompt with requirements, constraints, and source text if needed.`),
    }),
  });
