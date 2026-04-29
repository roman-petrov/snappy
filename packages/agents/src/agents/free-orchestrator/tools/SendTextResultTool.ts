/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/no-expression-statements */
import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const SendTextResultTool: FreeOrchestratorAgentTool = ({ publishText, storage }) =>
  AgentTool({
    description: `Publish text from Storage to the chat feed after prompt verification.`,
    formatCall: ({ fileName }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Публикую текст: ${fileName}`
          : `Опубликовал текст: ${fileName}`
        : status === `running`
          ? `Publishing text: ${fileName}`
          : `Published text: ${fileName}`,
    run: async ({ fileName, generationPrompt }) => {
      const read = storage.read(fileName);
      if (`error` in read) {
        return { error: `Text file for publishing was not found in Storage.` };
      }
      const { result: entry } = read;
      if (entry.kind !== `text`) {
        return { error: `Text file for publishing was not found in Storage.` };
      }
      if (entry.generationPrompt.trim() !== generationPrompt.trim()) {
        return { error: `generationPrompt does not match the request stored for this file.` };
      }

      publishText({ generationPrompt: entry.generationPrompt, html: entry.value });

      return `Result was sent to chat.`;
    },
    schema: z.object({
      fileName: z.string().min(1).describe(`Storage text file name to publish.`),
      generationPrompt: z
        .string()
        .min(1)
        .describe(`Original generation prompt. Must match the stored request exactly after trim.`),
    }),
  });
