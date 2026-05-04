import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const GenerateImageTool: FreeOrchestratorAgentTool = ({ streamImageArtifact }) =>
  AgentTool({
    description: [
      `One call runs a single configured image-model generation.`,
      `The feed shows an image card with a progress state until the image is ready.`,
      `The tool returns only an English success or error message to the agent — not image data or the full prompt echo.`,
    ].join(` `),
    run: async ({ prompt, size }) => {
      const ok = await streamImageArtifact({ prompt, size });
      if (!ok) {
        return { error: `Image was not generated.` };
      }

      return `Image generation completed successfully.`;
    },
    schema: z.object({
      prompt: z
        .string()
        .min(1)
        .describe(
          `Full visual prompt: subject, composition, style, lighting, palette, materials, level of detail, aspect intent, negatives, and any other controls agreed with the user.`,
        ),
      size: z
        .enum(AiConstants.imageSize)
        .optional()
        .describe(
          `Output pixel size. Allowed values: ${AiConstants.imageSize.join(`, `)}. Omit to use the default (typically 1024×1024).`,
        ),
    }),
  });
