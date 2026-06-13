/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const EditImageTool: SnappyToolFactory = ({ ai, config, feed, files, isStopped, media }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user wants to transform, combine, or edit existing image(s): remove background, restyle using a reference, inpaint, etc.`,
      ],
      [
        `input`,
        `Pass a self-contained edit prompt, field ids from ask file_input answers (in API order), and optional background/size. Request files via ask first.`,
      ],
      [`output`, `Returns artifactId. Use look_image with that id to inspect the published image.`],
    ],
    execute: async ({ background, files: fieldIds, prompt, size }) => {
      if (isStopped()) {
        return ``;
      }

      const images = fieldIds.flatMap(id => {
        const file = files[id];

        return file instanceof File ? [file] : [];
      });
      if (images.length === 0) {
        return { error: `No image files for fields: ${fieldIds.join(`, `)}. Run ask first.` };
      }

      const { artifactId, content } = await feed.generateImage({
        ai,
        edit: { background, images },
        model: config.models.image,
        prompt,
        size,
      });

      if (isStopped()) {
        return ``;
      }

      media[artifactId] = content;

      return JSON.stringify({ artifactId, status: `published` }, undefined, 2);
    },
    inputSchema: z.object({
      background: z.enum([`transparent`, `opaque`, `auto`]).optional().describe(`Output background when relevant.`),
      files: z
        .array(z.string().min(1))
        .min(1)
        .max(16)
        .describe(`Field ids from ask file_input answers, in the order required by the edit API.`),
      prompt: z.string().min(1).describe(`Self-contained edit instruction for the image model.`),
      size: z.enum(AiConstants.imageSize).optional().describe(`Output resolution in pixels.`),
    }),
  });
