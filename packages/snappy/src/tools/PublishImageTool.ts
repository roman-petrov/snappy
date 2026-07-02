import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

import { ToolContext } from "../ToolContext";

export const PublishImageTool: SnappyToolFactory = ({ config, feed, isStopped, locale, media }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user expects an image as the final result. Ask clarification first if key visual requirements are still unclear.`,
      ],
      [
        `input`,
        `Pass a self-contained prompt with required visual details and constraints. Set size only when the user requested dimensions or composition depends on resolution.`,
      ],
      [`output`, `Returns mediaId. The published image follows in the next user message.`],
    ],
    execute: async ({ prompt, size }) =>
      isStopped()
        ? ``
        : ToolContext.publishImage({
            feed,
            input: { locale, model: config.models.image, prompt, size },
            isStopped,
            media,
          }),
    inputSchema: z.object({
      prompt: z
        .string()
        .min(1)
        .describe(`Self-contained image prompt with all required visual details and constraints.`),
      size: z.enum(AiConstants.imageSize).optional().describe(`Output resolution in pixels. Omit to use the default.`),
    }),
  });
