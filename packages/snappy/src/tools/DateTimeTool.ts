/* eslint-disable @typescript-eslint/require-await */
import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const DateTimeTool: SnappyToolFactory = () =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when you need the current system date and time (planning, "today", deadlines, relative time phrases).`,
      ],
      [`input`, `No arguments.`],
      [`output`, `Returns the system date and time as a string from Date#toString().`],
    ],
    execute: async () => new Date().toString(),
    inputSchema: z.object({}),
  });
