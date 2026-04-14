import { AgentTool } from "@snappy/agent";
import { _ } from "@snappy/core";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const ChatTool: FreeOrchestratorAgentTool = ({ agentContext, input, storage }) =>
  AgentTool({
    description: `Generate text with host chat model and save it into Storage.`,
    formatCall: ({ fileName }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Генерирую текст: ${fileName}`
          : `Сгенерировал текст: ${fileName}`
        : status === `running`
          ? `Generating text: ${fileName}`
          : `Generated text: ${fileName}`,
    run: async ({ fileName, prompt }) => {
      const { hostTools, isStopped } = input;
      const out = await hostTools.chat(prompt);
      const text = _.isString(out) ? out : out.content;
      if (text.trim() === `` || agentContext.isStopped() || isStopped()) {
        return { error: `Text was not generated.` };
      }
      const wrote = storage.write(fileName, { generationPrompt: prompt, kind: `text`, value: text });
      if (`error` in wrote) {
        return { error: `File "${fileName}" already exists in Storage. Choose a new unique file name.` };
      }

      return `Text was saved to Storage: "${fileName}".`;
    },
    schema: z.object({
      fileName: z.string().min(1).describe(`Unique Storage file name for generated text.`),
      prompt: z.string().min(1).describe(`Prompt passed to the host chat model.`),
    }),
  });
