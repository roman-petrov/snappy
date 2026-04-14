/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/no-expression-statements */
import { AgentTool } from "@snappy/agent";
import { DataUrl } from "@snappy/browser";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const SendImageResultTool: FreeOrchestratorAgentTool = ({ input, storage }) =>
  AgentTool({
    description: `Publish an image from Storage to the chat feed after prompt verification.`,
    formatCall: ({ fileName }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Публикую изображение: ${fileName}`
          : `Опубликовал изображение: ${fileName}`
        : status === `running`
          ? `Publishing image: ${fileName}`
          : `Published image: ${fileName}`,
    run: async ({ fileName, generationPrompt }) => {
      const read = storage.read(fileName);
      if (`error` in read) {
        return { error: `Image file for publishing was not found in Storage.` };
      }
      const { result: entry } = read;
      if (entry.kind !== `image`) {
        return { error: `Image file for publishing was not found in Storage.` };
      }
      if (entry.generationPrompt.trim() !== generationPrompt.trim()) {
        return { error: `generationPrompt does not match the prompt stored for this file.` };
      }
      input.feed.append({ generationPrompt: entry.generationPrompt, src: DataUrl.png(entry.value), type: `image` });

      return `Result was sent to chat.`;
    },
    schema: z.object({
      fileName: z.string().min(1).describe(`Storage image file name to publish.`),
      generationPrompt: z
        .string()
        .min(1)
        .describe(`Original generation prompt. Must match the stored prompt exactly after trim.`),
    }),
  });
