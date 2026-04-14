/* eslint-disable @typescript-eslint/require-await */
import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const StorageListTool: FreeOrchestratorAgentTool = ({ storage }) =>
  AgentTool({
    description: `Show Storage structure: file list with kinds. Use before write to avoid accidental overwrite.`,
    formatCall: (_args, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Читаю список: Storage`
          : `Прочитал список: Storage`
        : status === `running`
          ? `Listing: Storage`
          : `Listed: Storage`,
    run: async () => {
      const { result: items } = storage.list();
      if (items.length === 0) {
        return `Storage is empty.`;
      }

      return items.map(item => `${item.name} (${item.kind})`).join(`\n`);
    },
    schema: z.object({}),
  });
