/* eslint-disable @typescript-eslint/require-await */
import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const StorageReadTool: FreeOrchestratorAgentTool = ({ storage }) =>
  AgentTool({
    description: `Read text content from Storage.`,
    formatCall: ({ fileName }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Читаю из Storage: ${fileName}`
          : `Прочитал из Storage: ${fileName}`
        : status === `running`
          ? `Reading from Storage: ${fileName}`
          : `Read from Storage: ${fileName}`,
    run: async ({ fileName }) => {
      const read = storage.read(fileName);
      if (`error` in read) {
        return { error: `File was not found in Storage.` };
      }
      const { result: entry } = read;
      if (entry.kind !== `text`) {
        return { error: `Requested file is not text. Only text content can be read.` };
      }

      return entry.value;
    },
    schema: z.object({ fileName: z.string().min(1).describe(`Storage file name to read.`) }),
  });
