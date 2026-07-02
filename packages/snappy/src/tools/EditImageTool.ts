import { AgentTool } from "@snappy/agent";
import { ImageSize } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

import { ImageTool } from "../ImageTool";
import { ToolContext } from "../ToolContext";

export const EditImageTool: SnappyToolFactory = ({
  config: {
    models: { image: model },
  },
  feed,
  files,
  isStopped,
  locale,
  media,
}) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user wants to transform, combine, or edit existing image(s): remove background, restyle using a reference, partial edits, etc.`,
      ],
      [
        `input`,
        `Pass a self-contained edit prompt, field ids from ask image_input answers (in API order), and optional background/sizing fields. Request files via ask first.`,
      ],
      [`output`, `Returns mediaId. The edited image follows in the next user message.`],
    ],
    execute: async ({ background, files: fieldIds, prompt, ...fields }) => {
      if (isStopped()) {
        return ``;
      }

      const images = fieldIds.flatMap(id => {
        const file = files[id];

        return file instanceof File ? [file] : [];
      });

      return images.length === 0
        ? { error: `No image files for fields: ${fieldIds.join(`, `)}. Run ask first.` }
        : ToolContext.publishImage({
            feed,
            input: {
              edit: { background, images },
              locale,
              model,
              prompt,
              ...ImageSize.request(model.imageConfigKind, fields),
            },
            isStopped,
            media,
          });
    },
    inputSchema: ImageTool.inputSchema(model, `Self-contained edit instruction for the image model.`, {
      background: z.enum([`transparent`, `opaque`, `auto`]).optional().describe(`Output background when relevant.`),
      files: z
        .array(z.string().min(1))
        .min(1)
        .max(16)
        .describe(`Field ids from ask image_input answers, in the order required by the edit API.`),
    }),
  });
