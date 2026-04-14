import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const ImageTool: FreeOrchestratorAgentTool = ({ agentContext, input, storage }) =>
  AgentTool({
    description: `Generate an image with host image model and save it into Storage.`,
    formatCall: ({ fileName }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Генерирую изображение: ${fileName}`
          : `Сгенерировал изображение: ${fileName}`
        : status === `running`
          ? `Generating image: ${fileName}`
          : `Generated image: ${fileName}`,
    run: async ({ fileName, prompt, size }) => {
      const { hostTools, isStopped } = input;
      const bytes = await hostTools.image(prompt, { size: size ?? `1024x1024` });
      if (bytes.length === 0 || agentContext.isStopped() || isStopped()) {
        return { error: `Image was not generated.` };
      }
      const wrote = storage.write(fileName, { generationPrompt: prompt, kind: `image`, value: bytes });
      if (`error` in wrote) {
        return { error: `File "${fileName}" already exists in Storage. Choose a new unique file name.` };
      }

      return `Image was saved to Storage: "${fileName}".`;
    },
    schema: z.object({
      fileName: z.string().min(1).describe(`Unique Storage file name for generated image.`),
      prompt: z.string().min(1).describe(`Image generation prompt.`),
      size: z.enum(AiConstants.imageSize).optional().describe(`Requested image size.`),
    }),
  });
