import { AgentTool } from "@snappy/agent";
import { AiVision } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const LookImageTool: SnappyToolFactory = ({ config, isStopped, media }) => {
  if (config.models.chat.capabilities.input.includes(`image`)) {
    return undefined;
  }

  return AgentTool({
    description: [
      [
        `when`,
        `Use when you need to inspect an uploaded or generated image: describe it, read text, check composition, verify publish results, etc.`,
      ],
      [
        `input`,
        `Pass a media id (ask field id or mediaId from publish_image / edit_image) and a focused prompt. Call multiple times with different prompts for different aspects.`,
      ],
      [`output`, `Returns a text answer from a vision pass over the image.`],
    ],
    execute: async ({ id, prompt }) => {
      if (isStopped()) {
        return ``;
      }

      const url = media[id];
      if (url === undefined) {
        return {
          error: `Unknown media id "${id}". Use ids from ask answers or mediaId from publish_image / edit_image.`,
        };
      }

      const content = await AiVision.prompt(config.models.vision, { prompt, url });

      return isStopped() ? `` : content;
    },
    formatCall: (_input, status, loc) =>
      status === `running` ? (loc === `ru` ? `Изучаю изображение…` : `Inspecting image…`) : ``,
    inputSchema: z.object({
      id: z.string().min(1).describe(`Media id from ask field id or mediaId from publish_image / edit_image.`),
      prompt: z.string().min(1).describe(`What to inspect or answer about the image.`),
    }),
  });
};
