import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const LookImageTool: SnappyToolFactory = ({ ai, config, isStopped, media }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when you need to inspect an uploaded or generated image: describe it, read text, check composition, verify publish results, etc.`,
      ],
      [
        `input`,
        `Pass a media id (ask file_input field id or publish artifactId) and a focused prompt. Call multiple times with different prompts for different aspects.`,
      ],
      [`output`, `Returns a text answer from a vision pass over the image.`],
    ],
    execute: async ({ id, prompt }) => {
      if (isStopped()) {
        return ``;
      }

      const url = media[id];
      if (url === undefined) {
        return { error: `Unknown media id "${id}". Use ids from ask answers or publish artifactId.` };
      }

      const session = ai.chat.completions.create({
        messages: [
          {
            content: [
              { text: prompt, type: `text` },
              { type: `image`, url },
            ],
            role: `user`,
          },
        ],
        model: config.models.look,
        reasoningEffort: `none`,
      });

      const assistant = await session.assistant();

      return isStopped() ? `` : assistant.content;
    },
    formatCall: (_input, status, loc) =>
      status === `running` ? (loc === `ru` ? `Изучаю изображение…` : `Inspecting image…`) : ``,
    inputSchema: z.object({
      id: z.string().min(1).describe(`Media id from ask file answer or publish artifactId.`),
      prompt: z.string().min(1).describe(`What to inspect or answer about the image.`),
    }),
  });
