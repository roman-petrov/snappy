/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const PublishImageTool: SnappyToolFactory = ({ ai, config, feed, isStopped, media }) =>
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
      [`output`, `Returns artifactId. Use look_image with that id to inspect the published image.`],
    ],
    execute: async ({ prompt, size }) => {
      if (isStopped()) {
        return ``;
      }
      const { artifactId, content } = await feed.generateImage({ ai, model: config.models.image, prompt, size });

      if (isStopped()) {
        return ``;
      }

      media[artifactId] = content;

      return JSON.stringify({ artifactId, status: `published` }, undefined, 2);
    },
    inputSchema: z.object({
      prompt: z
        .string()
        .min(1)
        .describe(`Self-contained image prompt with all required visual details and constraints.`),
      size: z.enum(AiConstants.imageSize).optional().describe(`Output resolution in pixels. Omit to use the default.`),
    }),
  });
