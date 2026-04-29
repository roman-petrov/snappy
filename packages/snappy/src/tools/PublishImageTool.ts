/* eslint-disable functional/no-expression-statements */
import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const PublishImageTool: SnappyToolFactory = ({ ai, config, feed, isStopped }) =>
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
      [
        `output`,
        `You only get success/failure text (no visual bytes). Show the full prompt in chat when calling this tool.`,
      ],
    ],
    execute: async ({ prompt, size }) => {
      if (isStopped()) {
        return ``;
      }
      await feed.generateImage({ ai, model: config.models.image, prompt, size });

      return isStopped() ? `` : `Image generation completed successfully.`;
    },
    inputSchema: z.object({
      prompt: z
        .string()
        .min(1)
        .describe(`Self-contained image prompt with all required visual details and constraints.`),
      size: z.enum(AiConstants.imageSize).optional().describe(`Output resolution in pixels. Omit to use the default.`),
    }),
  });
